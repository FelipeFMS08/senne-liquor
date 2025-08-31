import { authClient } from "@/lib/auth-client";
import { Navigate, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";

const formSchema = z.object({
  email: z.email("Email inválido"),
  password: z
    .string("Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginPage() {
  const data = authClient.useSession();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (data.isPending) {
    return <div>Carregando...</div>;
  }

  const isAuthenticated = !!data.data?.session;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values: FormValues) {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          navigate("/dashboard");

        },
        onError: (error) => {
          form.setError("email", {
            type: "manual",
            message: error.error.message,
          });
          form.setError("password", {
            type: "manual",
            message: error.error.message,
          });
        },
      },
    });
  }

  return (
    <div className="bg-zinc-200 min-h-screen w-screen flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-col items-center">
          <img src="/logo.png" alt="React Logo" className="w-md"/>
          <CardTitle className="text-xl">Acessar a Plataforma</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="py-5" placeholder="Digite seu Email." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                      className="py-5" 
                        placeholder="Digite sua senha."
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full py-6 font-bold text-xl">
                Acessar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};