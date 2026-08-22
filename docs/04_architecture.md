# Architecture

> colleboxのシステム構成・コンポーネント間の関係・データの流れを定義する。
>
> **Status: Draft**
>
> 技術選定や実装の進行に応じて更新する。

## 1. システム概要

colleboxは、コレクショングッズをWebブラウザから管理・検索・閲覧するWebアプリケーションである。

ユーザーはWebブラウザからグッズの登録・閲覧・編集・削除や検索・絞り込みを行う。

### 1.1 基本的なデータフロー

```text
[User]
   │
   │ HTTPS
   ▼
[Next.js Application]
   │
   ├──────────────► [Image Storage]
   │
   │ Drizzle
   ▼
[PostgreSQL]
```

1. ユーザーがWebブラウザから操作する
2. Webアプリケーションがリクエストを受け取る
3. アプリケーションが必要な処理を行う
4. PostgreSQLからグッズ情報を取得・更新する
5. 必要に応じて画像ストレージと連携する
6. 結果をWebブラウザに返す

## 2. コンポーネント


### 2.1 技術スタック

現時点で以下の技術を採用する。
未決定の項目については TBD とする。

| 領域 | 技術 | 用途 |
|---|---|---|
| Frontend | Next.js + TypeScript | Web UIの構築 |
| Backend | Next.js Server / Route Handlers | API・サーバーサイド処理 |
| Database | PostgreSQL | グッズ・コレクションデータの保存 |
| ORM | Drizzle | PostgreSQLへのアクセス |
| Image Storage | TBD | グッズ画像の保存 |
| Hosting | Vercel | Webアプリケーションのホスティング |
| DB Hosting | Supabase | PostgreSQLのホスティング・グッズ画像の保存 |
| CI/CD | GitHub Actions | テスト・Lint・ビルドなどの自動化 |
| Testing | Vitest + Playwright | Unit / Integration / E2Eテスト |
| Code Quality | ESLint + Prettier | コード品質・フォーマット管理 |

### 2.2 Frontend

ユーザーが操作するWeb UIを提供する。

主な責務：

- グッズ一覧の表示
- グッズ詳細の表示
- グッズ登録・編集フォーム
- 検索・絞り込みUI
- 所持数などの情報表示
- 画像の表示

---

### 2.3 Backend / API

Frontendからのリクエストを受け取り、データの取得・登録・更新・削除を行う。

主な責務：

- APIの提供
- リクエストのバリデーション
- ビジネスロジック
- PostgreSQLとの通信
- エラーハンドリング

想定するAPI：

```text
GET    /api/items
GET    /api/items/:id
POST   /api/items
PATCH  /api/items/:id
DELETE /api/items/:id
```

検索・絞り込みについては、クエリパラメータによる指定を検討する。

例：

```text
GET /api/items?character=A&category=バッジ
```

---

### 2.3 Database

PostgreSQLを使用する。

グッズおよび関連する属性を永続化する。

現時点で想定している主なデータ：

- Item
- Work
- Character
- Category
- Series
- Tag
- Collection

具体的なテーブル構造については `data-model.md` およびDB設計で定義する。

---

### 2.4 Image Storage

グッズ画像はデータベースに直接保存せず、外部ストレージへの保存を基本方針とする。

```text
Image
  │
  ▼
Object Storage
  │
  │ URL
  ▼
PostgreSQL
```

具体的なストレージサービスは技術選定時に決定する。

---

## 3. データフロー

### 3.1 グッズ一覧取得

```text
Browser
  │
  │ GET /api/items
  ▼
Backend
  │
  │ SQL
  ▼
PostgreSQL
  │
  │ Result
  ▼
Backend
  │
  │ JSON
  ▼
Browser
```

---

### 3.2 グッズ登録

```text
Browser
  │
  │ POST /api/items
  ▼
Backend
  │
  ├── Validate
  │
  ├── Business Logic
  │
  └── INSERT
        │
        ▼
    PostgreSQL
```

登録成功後、作成されたグッズ情報をFrontendに返す。

---

### 3.3 グッズ画像登録

```text
Browser
  │
  │ Upload
  ▼
Image Storage
  │
  │ URL
  ▼
Backend
  │
  │ Save image URL
  ▼
PostgreSQL
```

※ 実際のアップロード方式は技術選定時に決定する。

---

## 4. レイヤ構成

基本的には以下の責務を分離する。

```text
┌──────────────────────────┐
│       Presentation       │
│   Next.js UI / Pages     │
├──────────────────────────┤
│      Application/API     │
│   Route Handlers / Logic │
├──────────────────────────┤
│       Data Access        │
│         Drizzle          │
├──────────────────────────┤
│       PostgreSQL         │
└──────────────────────────┘
```

---
