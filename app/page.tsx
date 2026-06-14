
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
    <FormLayout bgImage="eojf" logo="adjfhba">
      <Form />
    </FormLayout>
  </AuthProvider>
);

export default Page;