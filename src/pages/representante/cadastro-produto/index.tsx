import { InputText } from "@/components/input-text";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Select } from "@/components/select";
import { FaUpload, FaImage, FaTimes, FaBox, FaTag, FaDollarSign, FaWeight, FaCalendarAlt } from "react-icons/fa";

type ProductsProps = {
  descricao: string;
  validade: string;
  peso: string;
  preco: string;
  categoria: string;
  marca: string;
};

const schema = z.object({
  descricao: z.string().min(1, "O campo é obrigatório."),
  validade: z.string().optional(),
  peso: z.string().optional(),
  preco: z.string().min(1, "O campo é obrigatório."),
  categoria: z.string().min(1, "O campo é obrigatório."),
  marca: z.string().min(1, "O campo é obrigatório."),
});

export default function NovoProduto() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductsProps>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [brandOptions, setBrandOptions] = useState<
    { value: string; label: string }[]
  >([]);


  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/categorias");
        
        if (!response.data || !Array.isArray(response.data)) {
          toast.error("Formato de dados de categorias inválido.", {
            position: "top-right",
          });
          return;
        }

        const categories = response.data.map((category: any) => ({
          value: category.nome,
          label: category.nome,
        }));
        
        setCategoryOptions(categories);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
        toast.error(`Erro ao buscar categorias: ${error.response?.data?.errormessage || error.message}`, {
          position: "top-right",
        });
      }
    }

    async function fetchBrands() {
      try {
        const response = await api.get("/marcas");
        const brands = response.data.map((brand: any) => ({
          value: brand.razao_social,
          label: brand.razao_social,
        }));
        setBrandOptions(brands);
      } catch (error) {
        console.error("Erro ao buscar marcas", error);
        toast.error("Erro ao buscar marcas.", {
          position: "top-right",
        });
      }
    }

    fetchCategories();
    fetchBrands();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione apenas arquivos de imagem.", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB.", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }

      setSelectedImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  async function handleRegisterProduct(dataProduct: ProductsProps) {
    const { categoria, marca, descricao, validade, peso, preco } = dataProduct;

    try {
      setLoading(true);

      // Criar FormData para enviar arquivo
      const formData = new FormData();
      
      // Preparar dados do produto
      const productData = {
        categoria: categoria,
        marca: marca,
        descricao: descricao,
        peso: peso ? Number(peso) : null,
        preco: Number(preco),
        validade: validade || null,
      };

      // Adicionar dados como JSON string
      formData.append('data', JSON.stringify(productData));
      
      // Adicionar imagem se selecionada
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await api.post("/cadastro-produto", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Produto cadastrado com sucesso!", {
        style: {
          background: "#333",
          color: "#fff",
        },
        position: "top-right",
      });
      
      reset();
      removeImage();
    } catch (error) {
      const errorMessage = error.response?.data?.errormessage || "Erro ao cadastrar produto.";
      toast.error(errorMessage, {
        style: {
          background: "#333",
          color: "#fff",
        },
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
            <FaBox className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Cadastrar Novo Produto
          </h1>
          <p className="text-gray-600 text-sm">
            Adicione um novo produto ao seu catálogo
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-focus p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaBox className="w-5 h-5" />
                Informações do Produto
              </h2>
            </div>

            <form onSubmit={handleSubmit(handleRegisterProduct)} className="p-6">
              {/* Layout em Grid Principal */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Image Upload Section */}
                <div className="xl:col-span-1">
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Imagem do Produto
                  </label>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <FaUpload className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Selecionar imagem
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG até 5MB
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-focus transition-colors"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 text-center truncate">
                          {selectedImage?.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information Grid */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome do Produto */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                      <FaTag className="w-4 h-4 text-primary" />
                      Nome do produto<span className="text-error">*</span>
                    </label>
                    <InputText
                      type="text"
                      name="descricao"
                      className="w-full"
                      placeholder="Digite o nome do produto"
                      register={register}
                      error={errors.descricao?.message}
                    />
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                      <FaDollarSign className="w-4 h-4 text-primary" />
                      Preço<span className="text-error">*</span>
                    </label>
                    <InputText
                      type="number"
                      name="preco"
                      className="w-full"
                      placeholder="0,00"
                      register={register}
                      error={errors.preco?.message}
                    />
                  </div>

                  {/* Peso */}
                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                      <FaWeight className="w-4 h-4 text-primary" />
                      Peso (kg)
                    </label>
                    <InputText
                      type="number"
                      name="peso"
                      className="w-full"
                      placeholder="0"
                      register={register}
                      error={errors.peso?.message}
                    />
                  </div>

                  {/* Validade */}
                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                      <FaCalendarAlt className="w-4 h-4 text-primary" />
                      Data de Validade
                    </label>
                    <InputText
                      type="date"
                      name="validade"
                      className="w-full"
                      placeholder=""
                      register={register}
                      error={errors.validade?.message}
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                      <FaTag className="w-4 h-4 text-primary" />
                      Categoria<span className="text-error">*</span>
                    </label>
                    <Select
                      name="categoria"
                      className="select select-bordered w-full"
                      register={register}
                      options={categoryOptions}
                      placeholder="Selecione uma categoria"
                      rules={{ required: "Por favor, selecione uma categoria" }}
                      error={errors.categoria?.message}
                    />
                  </div>

                  {/* Marca */}
                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                      <FaImage className="w-4 h-4 text-primary" />
                      Marca<span className="text-error">*</span>
                    </label>
                    <Select
                      name="marca"
                      className="select select-bordered w-full"
                      register={register}
                      options={brandOptions}
                      placeholder="Selecione uma marca"
                      rules={{ required: "Por favor, selecione uma marca" }}
                      error={errors.marca?.message}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4 mt-4 border-t border-gray-200">
                {loading ? (
                  <button
                    className="btn btn-primary px-8"
                    type="submit"
                    disabled
                  >
                    <span className="loading loading-spinner loading-sm"></span>
                    Cadastrando...
                  </button>
                ) : (
                  <button className="btn btn-primary px-8 gap-2" type="submit">
                    <FaBox className="w-4 h-4" />
                    Cadastrar Produto
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
