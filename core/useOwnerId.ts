import { useEffect, useState } from "react";
import { obterOwnerId } from "./repositories";

// Hook fino sobre obterOwnerId() — a maioria das telas só precisa disso
// pra chamar os repositórios.
export function useOwnerId(): string | null {
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    obterOwnerId().then((id) => {
      if (ativo) setOwnerId(id);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return ownerId;
}
