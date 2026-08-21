# data-model.md — collebox データモデル定義

## Item（グッズ）

コレクションの基本単位。

| フィールド名 | 型 | 必須 | 備考 |
|---|---|---|---|
| id | UUID | ✓ | |
| name | string | ✓ | グッズ名 |
| work | string | | 作品名 |
| character_names | string[] | | キャラ名（複数可） |
| category | string | | 種類（バッジ・アクキーなど） |
| medium | string | | 媒体（アニメ・原作など） |
| quantity | number | | 所持数 |
| target_quantity | number | | 収集目標数 |
| release_year | number | | 発売年 |
| external_url | string | | 外部サイトURL |
| images | string[] | | 画像ファイルパスまたはURL |
| created_at | datetime | ✓ | |
| updated_at | datetime | ✓ | |

### 備考

- `quantity` と `target_quantity` は達成率の計算に使う（`quantity / target_quantity * 100`）
- `images` は複数枚登録可とする

---

## 未決事項

- [ ] `category` は固定の選択肢にするか、自由入力にするか
- [ ] 画像はローカル保存かクラウドストレージか
- [ ] コレクション（グループ）の概念を持つか
