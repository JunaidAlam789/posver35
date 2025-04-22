import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./components/profile-form"
import { NotificationsForm } from "./components/notifications-form"
import { AppearanceForm } from "./components/appearance-form"

export const metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 pt-4 md:pt-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Separator />
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">Update your personal information and preferences.</p>
          <Separator className="my-4" />
          <ProfileForm />
        </div>
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
          <Separator className="my-4" />
          <NotificationsForm />
        </div>
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize the appearance of the app.</p>
          <Separator className="my-4" />
          <AppearanceForm />
        </div>
      </div>
    </div>
  )
}
