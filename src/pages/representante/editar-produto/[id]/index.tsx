import { InputText } from "@/components/input-text";
import { CurrencyInput } from "@/components/currency-input";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Select } from "@/components/select";
import { FaUpload, FaImage, FaTimes, FaBox, FaTag, FaDollarSign, FaWeight, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";

type ProductsProps = {
  descricao: string;
  validade: string;
  peso: string;
  preco: string;
  categoria: string;
  marca: string;
};

type ProductData = {
  id: number;
  descricao: string;
  validade: string;
  peso: number;
  preco: number;
  id_cat: number;
  id_marca: number;
  imagem?: string | number[] | { type: string; data: number[] } | any;
};

const schema = z.object({
  descricao: z.string().min(1, "O campo é obrigatório."),
  validade: z.string().optional(),
  peso: z.string().optional(),
  preco: z.string().min(1, "O campo é obrigatório."),
  categoria: z.string().min(1, "O campo é obrigatório."),
  marca: z.string().min(1, "O campo é obrigatório."),
});

export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductsProps>({
    resolver: zodResolver(schema),
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [brandOptions, setBrandOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productData, setProductData] = useState<ProductData | null>(null);

  // Buscar dados do produto
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      try {
        setLoadingProduct(true);
        const response = await api.get(`/produtos/id?id=${id}`);
        const product = response.data;
        

        
        setProductData(product);
        
        // Preencher o formulário com os dados existentes
        setValue("descricao", product.descricao);
        setValue("preco", product.preco.toString());
        setValue("peso", product.peso ? product.peso.toString() : "");
        setValue("validade", product.validade ? product.validade.split('T')[0] : "");
        
        // Definir imagem atual se existir
        if (product.imagem) {
          const imageUrl = getImageUrl(product.imagem);
          if (imageUrl) {
            // Extrair apenas a parte base64 da URL
            const base64Part = imageUrl.replace(/^data:image\/[^;]+;base64,/, '');
            setCurrentImage(base64Part);
          }
        }
        
      } catch (error) {
        console.error("Erro ao buscar produto", error);
        toast.error("Erro ao carregar dados do produto.", {
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        router.push("/produtos");
      } finally {
        setLoadingProduct(false);
      }
    }

    fetchProduct();
  }, [id, setValue, router]);

  // Buscar categorias e marcas
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

  // Definir categoria e marca após carregar os dados do produto e as opções
  useEffect(() => {
    if (productData && categoryOptions.length > 0 && brandOptions.length > 0) {
             // Para categoria - buscar o nome pela id_cat
       const setProductCategory = async () => {
         try {
           const categoriesResponse = await api.get("/categorias");
           const foundCategory = categoriesResponse.data.find((cat: any) => cat.id === productData.id_cat);
           if (foundCategory) {
             setValue("categoria", foundCategory.nome);
           }
         } catch (error) {
           console.error("Erro ao buscar categoria do produto", error);
         }
       };

                    // Para marca - buscar pela razao_social
       const setProductBrand = async () => {
         try {
                      // Como id_marca vem como "TESTE1", procurar diretamente nas opções
           const marcaValue = String(productData.id_marca);
           const brandExists = brandOptions.find(option => option.value === marcaValue);
           
           if (brandExists) {
             setValue("marca", marcaValue);
           }
         } catch (error) {
           console.error("Erro ao definir marca do produto", error);
         }
       };

      setProductCategory();
      setProductBrand();
    }
  }, [productData, categoryOptions, brandOptions, setValue]);

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
      
      // Criar preview da nova imagem
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
    // Forçar re-render do input com nova key
    setInputKey(prev => prev + 1);
  };

  const removeCurrentImage = () => {
    setCurrentImage(null);
  };

  // Função para obter a URL da imagem
  const getImageUrl = (imagem: string | number[] | undefined | any): string | null => {
    if (!imagem) return null;
    
    try {
      // Se já é uma string base64 válida
      if (typeof imagem === 'string') {
        // Se já contém o data:image prefix, retorna como está
        if (imagem.startsWith('data:image/')) {
          return imagem;
        }
        // Se é apenas a string base64, adiciona o prefixo
        return `data:image/jpeg;base64,${imagem}`;
      }
      
      // Se é um objeto Buffer (vindo do Prisma/PostgreSQL)
      if (imagem && typeof imagem === 'object' && imagem.data && Array.isArray(imagem.data)) {
        const bytes = new Uint8Array(imagem.data);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        return `data:image/jpeg;base64,${base64}`;
      }
      
      // Se é um array de bytes
      if (Array.isArray(imagem)) {
        const bytes = new Uint8Array(imagem);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        return `data:image/jpeg;base64,${base64}`;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      return null;
    }
  };

  async function handleUpdateProduct(dataProduct: ProductsProps) {
    if (!productData?.id) return;

    const { categoria, marca, descricao, validade, peso, preco } = dataProduct;

    try {
      setLoading(true);

      // Criar FormData para enviar arquivo
      const formData = new FormData();
      
      // Preparar dados do produto
      const productUpdateData = {
        id: Number(productData.id),
        categoria: categoria,
        marca: marca,
        descricao: descricao,
        peso: peso ? Number(peso) : null,
        preco: Number(preco.replace(',', '.')), // Converte vírgula para ponto
        validade: validade || null,
      };

      // Adicionar dados como JSON string
      formData.append('data', JSON.stringify(productUpdateData));
      
      // Adicionar imagem se selecionada uma nova
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await api.patch("/atualizar-produto", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Produto atualizado com sucesso!", {
        style: {
          background: "#333",
          color: "#fff",
        },
        position: "top-right",
      });
      
      // Redirecionar para a lista de produtos
      router.push("/produtos");
      
    } catch (error) {
      const errorMessage = error.response?.data?.errormessage || "Erro ao atualizar produto.";
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

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-base-200">
        <Header />
        <div className="flex flex-col justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-600">Carregando dados do produto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
            <FaEdit className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Editar Produto
          </h1>
          <p className="text-gray-600 text-sm">
            Atualize as informações do produto
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-focus p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaEdit className="w-5 h-5" />
                  Editar Informações do Produto
                </h2>
                <Link href="/produtos">
                  <button className="btn btn-ghost btn-sm text-white hover:bg-white/20">
                    Voltar
                  </button>
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleUpdateProduct)} className="p-6">
              {/* Layout em Grid Principal */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Image Upload Section */}
                <div className="xl:col-span-1">
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Imagem do Produto
                  </label>
                  <div className="space-y-4">
                    {/* Current Image */}
                    {currentImage && !imagePreview && (
                      <div className="relative">
                        <img
                          src={`data:image/jpeg;base64,${currentImage}`}
                          alt="Imagem atual"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeCurrentImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-error-focus transition-colors"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 text-center">
                          Imagem atual
                        </p>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                      <input
                        key={inputKey}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        ref={fileInputRef}
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
                            {currentImage ? 'Alterar imagem' : 'Selecionar imagem'}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG até 5MB
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* New Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Nova imagem"
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
                          Nova imagem: {selectedImage?.name}
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
                    <CurrencyInput
                      name="preco"
                      className="w-full"
                      placeholder="25,99"
                      register={register}
                      setValue={setValue}
                      error={errors.preco?.message}
                      initialValue={productData?.preco?.toString() || ''}
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
              <div className="flex justify-center gap-4 pt-4 mt-4 border-t border-gray-200">
                <Link href="/produtos">
                  <button className="btn btn-ghost px-8" type="button">
                    Cancelar
                  </button>
                </Link>
                {loading ? (
                  <button
                    className="btn btn-primary px-8"
                    type="submit"
                    disabled
                  >
                    <span className="loading loading-spinner loading-sm"></span>
                    Atualizando...
                  </button>
                ) : (
                  <button className="btn btn-primary px-8 gap-2" type="submit">
                    <FaEdit className="w-4 h-4" />
                    Atualizar Produto
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