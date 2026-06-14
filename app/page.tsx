
"use client" ///just for testing do not make page.tsx use client in anthor project
import FormLayout from "@/components/form-layout";
import Form from "@/components/email-password-form";
import { toast } from "sonner";
import { forgotPasswordAdmin, loginAdmin } from "@/actions/auth.actions";

const Page = () => (

  <FormLayout
    bgImage="https://admin.targetmobiles.com/img/tg-bg.27ac45d5.jpg"
    logo="https://admin.targetmobiles.com/img/target-logo.689bb7df.png">
    <Form
      loginFn={(data) => loginAdmin(data, "/admins/login", "https://api.targetmobiles.com")}
      forgotPasswordFn={(data) => forgotPasswordAdmin(data, "/admins/forgot", "https://api.targetmobiles.com")}
      onSuccess={(res) => {
        console.log(res);
        toast.success("Logged in successful")
      }}
    />
  </FormLayout>
);

export default Page;