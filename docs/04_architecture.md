# アーキテクチャ

この文書は移行後の設計を示す。リポジトリの現行実装は Next.js + TypeScript / Drizzle。採用方針、選定理由、未確定の候補は [技術選定](02_tech-stack.md) を参照。

## 1. システム構成

```text
ブラウザ
  ├─ React + TypeScript の SPA を取得 ← 静的ホスティング（Vite のビルド成果物）
  ├─ HTTPS / ログイン・セッション管理 → Supabase Auth
  └─ HTTPS / JSON + Bearer アクセストークン → Go REST API
                                                 ├─ SQL → Supabase PostgreSQL
                                                 └─ オブジェクト操作 → Cloudflare R2
```

| コンポーネント | 責務 |
|---|---|
| React SPA | 一覧・詳細・登録・編集、検索・絞り込み、所持数・達成率・画像の表示。Supabase Auth でセッションを管理し、グッズデータは Go API 経由で取得・更新する。 |
| Go REST API | 認証・認可、入力検証、グッズの CRUD・検索、エラー応答、DB と画像ストレージへのアクセス。 |
| Supabase Auth | ログイン、セッション、アクセストークンの発行。 |
| Supabase PostgreSQL | グッズ、所有者、画像のオブジェクトキーの永続化。論理モデルは [データモデル](03_data-model.md) を参照。 |
| Cloudflare R2 | 非公開バケットにグッズ画像の本体を保存する。 |

## 2. 認証とデータの所有権

初期リリースは本人用の 1 アカウントを想定する。複数ユーザーへの公開やコレクション共有は将来の検討事項とする。

1. SPA が Supabase Auth でログインし、`Authorization: Bearer <access_token>` を付けて Go API を呼ぶ。
2. Go API が署名、発行元、有効期限、想定する対象者（audience）を検証し、初期リリースで許可されたユーザーか確認する。
3. Go API は検証済みトークンの `sub` を所有者 ID として使う。作成時に所有者を設定し、一覧・詳細・更新・削除・画像操作では所有者を照合する。
4. Go API からの SQL 接続ではブラウザの JWT が DB に自動伝播しないため、Go 側の所有者チェックを必須とする。DB のロールと RLS の設定は接続方式と合わせて決める。

DB と R2 の接続用資格情報は API 側で管理する。SPA と API が別オリジンの場合は、API の CORS で許可するフロントエンドのオリジンを明示する。

[Supabase Auth の JWT](https://supabase.com/docs/guides/auth/jwts)

## 3. API とデータフロー

### 3.1 グッズ管理

エンドポイント案は以下のとおり。

```text
GET    /api/items
GET    /api/items/{id}
POST   /api/items
PATCH  /api/items/{id}
DELETE /api/items/{id}
```

- 一覧取得では Go API が所有者の範囲で検索・絞り込み・ページングし、結果を JSON で返す。検索条件はクエリパラメータで渡す案とする（例 `GET /api/items?character=A&category=バッジ`）。
- 登録・更新では Go API が入力と権限を検証して PostgreSQL に保存し、結果を返す。
- パラメータ、レスポンス、エラーの詳細は API 設計時に決める。契約の記述には OpenAPI を候補とする。

### 3.2 画像の登録と閲覧

1. Go API が対象グッズの所有権を確認する。アップロードは、Go API 経由または短命の署名付き URL を使ったブラウザから R2 への直接転送を候補とする。
2. アップロード成功を確認してから、Go API が R2 のオブジェクトキーを PostgreSQL に保存する。DB への登録失敗やグッズ削除で残った画像の扱いは実装時に決める。
3. 閲覧時も Go API が所有権を確認する。画像の配信は Go API 経由または短命の署名付き URL を候補とする。

## 4. レイヤ構成と拡張

フロントエンドは表示と入力を担う。Go API 内では HTTP の入出力、グッズ管理の処理、PostgreSQL・R2 へのアクセスの責務を分ける。

API はセッションや画像をインスタンスのローカル状態に保持せず、必要に応じてインスタンスを増やせる構成とする。DB への負荷は、ページング、クエリ・インデックスの見直し、API 全体の接続数の制御で対応する。ルーター、DB アクセスライブラリ、コンテナ、ホスティング、CI/CD は [技術選定の候補](02_tech-stack.md#候補未確定事項) を参照。
