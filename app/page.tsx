
import FormLayout from "@/components/form-layout";
import Form from "@/components/email-password-form";
import { AuthProvider } from "@/context/auth.provider";

const Page = () => (
  <AuthProvider
    config={{
      apiUrl: "https://admin.targetmobiles.com",
      loginUrl: "/admins/login",
      forgotPasswordUrl: "/admins/forgot-password",
    }}
  >
    <FormLayout
      bgImage="https://admin.targetmobiles.com/img/tg-bg.27ac45d5.jpg"
      logo="https://admin.targetmobiles.com/img/target-logo.689bb7df.png">
      <Form
      />
    </FormLayout>
  </AuthProvider>
);

export default Page;