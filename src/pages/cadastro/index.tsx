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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4 md:p-10">
      <div className="w-full max-w-4xl">
        <div className="bg-white/80 backdrop-blur-lg w-full p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
          {/* Header Section with animation */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <FaAddressCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar sua conta</h1>
            <p className="text-gray-600">Preencha os dados para começar</p>
          </div>

          <div className="w-full">
            <form
              className="flex flex-col space-y-6"
              onSubmit={handleSubmit(handleSignUp)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Você é um
                  </label>
                  <Select
                    name="categoria"
                    className="select select-bordered w-full bg-transparent border-gray-300 focus:border-indigo-500 transition-colors duration-200"
                    register={register}
                    options={categoryOptions}
                    placeholder="Selecione uma categoria"
                    rules={{ required: "Por favor, selecione uma categoria" }}
                    error={errors.categoria?.message}
                  />
                </div>

                {/* CNPJ Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    CNPJ
                  </label>
                  <InputText
                    mask="99.999.999/9999-99"
                    type="text"
                    className="grow bg-transparent"
                    name="cnpj"
                    placeholder="Digite seu CNPJ"
                    icon={<FaUser className="text-gray-500" />}
                    register={register}
                    error={errors.cnpj?.message}
                  />
                </div>

                {/* Company Name Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Razão Social
                  </label>
                  <InputText
                    type="text"
                    className="grow bg-transparent"
                    name="razao_social"
                    placeholder="Digite o nome da sua loja"
                    icon={<FaAddressCard className="text-gray-500" />}
                    register={register}
                    error={errors.razao_social?.message}
                  />
                </div>

                {/* Revenue Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Receita bruta
                  </label>
                  <InputText
                    type="text"
                    className="grow bg-transparent"
                    name="receita_bruta"
                    placeholder="Digite sua receita bruta caso seja cliente"
                    icon={<MdAttachMoney size={18} className="text-gray-500" />}
                    register={register}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Email
                  </label>
                  <InputText
                    type="email"
                    className="grow bg-transparent"
                    name="email"
                    placeholder="Digite o seu email"
                    icon={<FaEnvelope className="text-gray-500" />}
                    register={register}
                    error={errors.email?.message}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Senha
                  </label>
                  <InputText
                    type="password"
                    className="grow bg-transparent"
                    name="password"
                    placeholder="Digite sua senha"
                    icon={<FaKey className="text-gray-500" />}
                    register={register}
                    error={errors.password?.message}
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Confirmar senha
                  </label>
                  <InputText
                    type="password"
                    className="grow bg-transparent"
                    name="passwordC"
                    placeholder="Confirme a sua senha"
                    icon={<FaKey className="text-gray-500" />}
                    register={register}
                    error={errors.passwordC?.message}
                  />
                </div>
              </div>

              {/* Login Link & Submit Button */}
              <div className="space-y-6 pt-4">
                <div className="flex justify-between items-center">
                  <Link 
                    href="/login" 
                    className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200 text-sm"
                  >
                    Já possui uma conta? Faça login
                  </Link>
                </div>

                <button 
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl transition-colors duration-200 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
                  type="submit"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="space-x-1">
            <span>Ao criar uma conta, você concorda com nossos</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Termos de Uso
            </a>
            <span>e</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
