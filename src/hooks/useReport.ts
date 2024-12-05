import { useState } from "react";
import { api } from "@/services/apiCliente";
import toast from "react-hot-toast";
import { UserProps } from "@/contexts/AuthContex";

export function useReport() {
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleDownloadReport = async (localUser: UserProps) => {
    try {
      setLoadingDownload(true);
      const response = await api.post(
        "relatorio",
        {
          cnpj: localUser.cnpj,
          categoria: localUser.categoria,
          opcao: "D",
        },
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobURL = window.URL.createObjectURL(blob);
      /*  const link = document.createElement("a");
      link.href = blobURL;
      link.download = "relatorio.pdf"; 
      link.click();
      window.URL.revokeObjectURL(blobURL); */
      window.open(blobURL);
      toast.success("Relatório baixado com sucesso!", {
        duration: 1500,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erro ao baixar relatório";
      toast.error(errorMessage, {
        duration: 2000,
        position: "top-center",
      });
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleGenerateReport = async (localUser: UserProps) => {
    try {
      setLoadingEmail(true);
      const response = await api.post("/relatorio", {
        cnpj: localUser.cnpj,
        categoria: localUser.categoria,
        opcao: "E",
      });
      const result = response.data.message;
      toast.success(result, {
        duration: 1500,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Erro ao gerar relatório. Tente novamente mais tarde.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return {
    loadingDownload,
    loadingEmail,
    handleDownloadReport,
    handleGenerateReport,
  };
}
