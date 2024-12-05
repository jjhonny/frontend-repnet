import { useContext } from "react";
import { InputText } from "@/components/input-text";
import { Select } from "@/components/select";
import { AuthContext, SignUpProps } from "@/contexts/AuthContex";
import { FaAddressCard, FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdAttachMoney } from "react-icons/md";

const schema = z.object({
  categoria: z.string().min(1, "A categoria do usuário é obrigatória."),
  razao_social: z.string().min(1, "A Razão social é obrigatória."),
  cnpj: z.string().min(1, "O cnpj é obrigatório."),
  receita_bruta: z.string(),
  email: z.string().min(1, "O email é obrigatório."),
  password: z.string().min(1, "A senha é obrigatória."),
  passwordC: z.string().min(1, "Confirmar a senha é obrigatório."),
});

export default function Cadastro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpProps>({
    resolver: zodResolver(schema),
  });
  const { signUp } = useContext(AuthContext);
  const categoryOptions = [
    { value: "R", label: "Representante" },
    { value: "C", label: "Cliente" },
  ];

  async function handleSignUp(data: SignUpProps) {
    const { categoria, cnpj, email, password, passwordC, razao_social } = data;
    let { receita_bruta } = data;

    receita_bruta = Number(receita_bruta);

    const dataSignUp = {
      categoria: categoria,
      cnpj: cnpj,
      receita_bruta: receita_bruta,
      email: email,
      password: password,
      passwordC: passwordC,
      razao_social: razao_social,
    };

    await signUp(dataSignUp);
  }

  return (
    <>
      <main className="bg-base-200 w-full min-h-screen flex justify-center items-center p-4 md:p-10">
        <div className="bg-white w-full max-w-4xl p-6 md:p-8 py-5 flex flex-col rounded-lg shadow-lg">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-2xl md:text-4xl mb-4">Criar Conta</h1>
          </div>
          <div className="w-full">
            <form
              className="flex flex-col space-y-4"
              onSubmit={handleSubmit(handleSignUp)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="font-bold">Você é um</span>
                  <Select
                    name="categoria"
                    className="select select-bordered w-full mt-2"
                    register={register}
                    options={categoryOptions}
                    placeholder="Selecione uma categoria"
                    rules={{ required: "Por favor, selecione uma categoria" }}
                    error={errors.categoria?.message}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">CNPJ</span>
                  <InputText
                    mask="99.999.999/9999-99"
                    type="text"
                    className="grow"
                    name="cnpj"
                    placeholder="Digite seu CNPJ"
                    icon={<FaUser />}
                    register={register}
                    error={errors.cnpj?.message}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Razão Social</span>
                  <InputText
                    type="text"
                    className="grow"
                    name="razao_social"
                    placeholder="Digite o nome da sua loja"
                    icon={<FaAddressCard />}
                    register={register}
                    error={errors.razao_social?.message}
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-bold">Receita bruta</span>
                  <InputText
                    type="text"
                    className="grow"
                    name="receita_bruta"
                    placeholder="Digite sua receita bruta caso seja cliente"
                    icon={<MdAttachMoney size={18} />}
                    register={register}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Email</span>
                  <InputText
                    type="email"
                    className="grow"
                    name="email"
                    placeholder="Digite o seu email"
                    icon={<FaEnvelope />}
                    register={register}
                    error={errors.email?.message}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Senha</span>
                  <InputText
                    type="password"
                    className="grow"
                    name="password"
                    placeholder="Digite sua senha"
                    icon={<FaKey />}
                    register={register}
                    error={errors.password?.message}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">Confirmar senha</span>
                  <InputText
                    type="password"
                    className="grow"
                    name="passwordC"
                    placeholder="Confirme a sua senha"
                    icon={<FaKey />}
                    register={register}
                    error={errors.passwordC?.message}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-3">
                <Link className="link link-hover opacity-90" href="/login">
                  Já possui uma conta?
                </Link>
              </div>
              <div className="flex justify-center items-center mt-5">
                <button className="btn btn-primary w-full" type="submit">
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
