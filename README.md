# Crownia - 「売れっ子キャバ嬢の頭脳」

キャバ嬢向けのモバイルファースト顧客管理・営業支援AIアプリ（MVP）です。  
Next.js 14+ (App Router)、Supabase、Stripeを利用しています。

## 環境構築

### 1. リポジトリのクローンとパッケージインストール
```bash
git clone <repository_url>
cd Crownia
npm install
```

### 2. 環境変数の設定
`.env.example` をコピーして `.env.local` を作成し、各種APIキーを入力します。
```bash
cp .env.example .env.local
```

### 3. Supabaseのセットアップ
1. Supabaseプロジェクトを作成します。
2. Supabaseダッシュボードの SQL Editor にアクセスし、プロジェクトルートにある `supabase/schema.sql` の内容をコピーして実行します。
3. これにより、7つの基本テーブル、enum、RLSポリシー、`profiles`自動作成トリガーが作成されます。

### 4. LINEログイン設定（Supabase Auth）
1. LINE Developersコンソールでチャネルを作成（種類：LINEログイン）。
2. プロバイダー設定で「Email address permission」を申請（任意ですが、取得できると便利です）。
3. LINEチャネル設定の「コールバックURL」に以下を設定：
   `https://<your_supabase_project_ref>.supabase.co/auth/v1/callback`
4. Supabaseダッシュボード > Authentication > Providers に移動。
5. 「LINE」を有効化し、LINE Developersコンソールの「Channel ID」と「Channel Secret」を設定します。
6. `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定してください。

### 5. Stripe設定（課金・サブスクリプション）
1. Stripeダッシュボード（テストモード推奨）にて、新しい商品（Product）を「Basic」と「Pro」の2つ作成します。
2. 必ず各Productのメタデータ（Metadata）に `app = crownia` を追加してください（既存アプリのデータ混同を防ぐため）。
3. `.env.local` に `STRIPE_SECRET_KEY` と `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` を設定します。
4. **Webhookのテスト**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   表示されるWebhook Signing Secretを `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定します。

### 6. ローカルサーバーの起動
```bash
npm run dev
```
`http://localhost:3000` にアクセスして動作を確認します。

## デプロイメント (Vercel)
1. VercelにてGitHubリポジトリをインポートします。
2. 環境変数（Environment Variables）に `.env.local` で使用したキーを全て設定します。
   - 変更点: `APP_BASE_URL` をVercelのプロダクションURL（例：`https://crownia.vercel.app`）にします。
3. LINE DevelopersコンソールのコールバックURLにプロダクションパスを追加します。
4. Stripeダッシュボード（本番環境）でWebhookエンドポイントを `https://crownia.vercel.app/api/stripe/webhook` に登録します。

## ライセンス
プロジェクト専用のライセンス条項に準じます。
