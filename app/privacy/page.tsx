import { TopNav } from "@/components/navigation/top-nav"
import { Footer } from "@/components/home/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">IELTS WriteBetter</p>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: January 2025</p>
          </div>

          <p className="text-muted-foreground">
            Your data helps us deliver AI-powered feedback. We keep what we collect to a minimum and use it only to run
            the product, improve quality, and comply with legal obligations.
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Data we collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Account details you provide (email, name) to let you sign in and personalize the app.</li>
              <li>Essays and prompts you submit so we can generate scores, feedback, and reports.</li>
              <li>Basic usage and device info (logs, error reports) to keep the service reliable.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">How we use your data</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Process submissions with AI models to return prompts, scores, and improvement suggestions.</li>
              <li>Maintain security, prevent abuse, and enforce fair-use limits.</li>
              <li>Improve the product experience through anonymized analytics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Your choices</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You can delete your submissions and stop using the service at any time.</li>
              <li>
                Avoid including sensitive personal data in essays. We process content you provide to deliver feedback.
              </li>
              <li>
                When AI is unavailable, we may serve fallback suggestions or sample prompts so the app remains usable.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">
              Questions about privacy? Reach us using the contact links in the footer. We will respond promptly.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
