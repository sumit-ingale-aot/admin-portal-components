
"use client" ///just for testing do not make page.tsx use client in anthor project
import FormLayout from "@/components/form-layout";
import Form from "@/components/email-password-form";
import { AuthProvider } from "@/context/auth.provider";
import { toast } from "sonner";

const Page = () => (
  <AuthProvider
    config={{
      apiUrl: "https://api.targetmobiles.com",
      loginUrl: "/admins/login",
      forgotPasswordUrl: "/admins/forgot",
      redirectUrl: "/dashboard"
    }}
  >
    <FormLayout
      bgImage="https://admin.targetmobiles.com/img/tg-bg.27ac45d5.jpg"
      logo="https://admin.targetmobiles.com/img/target-logo.689bb7df.png">
      <Form
        onSuccess={(res) => {
          console.log(res);
          toast.success("Logged in successful")
        }}
      />
    </FormLayout>
  </AuthProvider>
);

export default Page;