# data-model.md — collebox データモデル定義

## Item（グッズ）

コレクションの基本単位。以下は移行後の論理モデル。

| フィールド名 | 型 | 必須 | 備考 |
|---|---|---|---|
| id | UUID | ✓ | |
| owner_id | UUID | ✓ | Supabase Auth のユーザー ID |
| name | string | ✓ | グッズ名 |
| series | string | | コンプ率の集計単位。1 件の Item はグッズ 1 種を表す |
| work | string | | 作品名 |
| character_names | string[] | | キャラ名（複数可） |
| category | string | | 種類（バッジ・アクキーなど） |
| medium | string | | 媒体（アニメ・原作など） |
| quantity | number | | 所持数 |
| target_quantity | number | | 収集目標数 |
| release_year | number | | 発売年 |
| external_url | string | | 公式商品ページなどの URL |
| images | string[] | | Cloudflare R2 のオブジェクトキー |
| created_at | datetime | ✓ | |
| updated_at | datetime | ✓ | |

### 備考

- `quantity` と `target_quantity` は達成率の計算に使う（`quantity / target_quantity * 100`）
- `images` は複数枚登録可とする

---

## 未決事項

- [ ] `category` は固定の選択肢にするか、自由入力にするか
- [ ] 画像キーを配列カラムで保持するか、画像用テーブルに分けるか
- [ ] コレクション（グループ）の概念を持つか
