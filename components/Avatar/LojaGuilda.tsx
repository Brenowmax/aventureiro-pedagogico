"use client";

type LojaGuildaProps = {
  saldo: number;
  onComprar: (item: LojaItem) => void;
  itensComprados: string[];
};

type LojaItem = {
  id: string;
  nome: string;
  categoria: "Head" | "Skin" | "Buddy";
  src?: string;
  preco: number;
  descricao: string;
};

const itensLoja: LojaItem[] = [
  {
    id: "head-1",
    nome: "Cabelo 1",
    categoria: "Head",
    src: "/head/Head1.png",
    preco: 0,
    descricao: "Um novo visual para o seu aventureiro.",
  },
  {
    id: "head-2",
    nome: "Cabelo 2",
    categoria: "Head",
    src: "/head/Head2.png",
    preco: 0,
    descricao: "Um estilo diferente para sua jornada.",
  },
  {
    id: "skin-1",
    nome: "Uniforme 1",
    categoria: "Skin",
    src: "/skin/Uniforme1.png",
    preco: 0,
    descricao: "Vista o uniforme da guilda.",
  },
  {
    id: "buddy-1",
    nome: "Companheiro Misterioso",
    categoria: "Buddy",
    preco: 0,
    descricao: "Em breve: um companheiro para acompanhar sua aventura.",
  },
];

const categorias: LojaItem["categoria"][] = [
  "Head",
  "Skin",
  "Buddy",
];

export default function LojaGuilda({
  saldo,
  onComprar,
  itensComprados,
}: LojaGuildaProps) {
  return (
    <div className="w-full space-y-5">
      {/* =====================================================
          CABEÇALHO DA LOJA
      ===================================================== */}
      <div className="rounded-2xl border border-amber-900/50 bg-[#11150f] p-4 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-500">
              Loja da Guilda
            </div>

            <div className="mt-1 text-[10px] text-slate-500">
              Adquira novos equipamentos para o seu aventureiro.
            </div>
          </div>

          {/* SALDO */}
          <div className="flex items-center gap-2 rounded-xl border border-amber-900/40 bg-black/30 px-4 py-2">
            <span className="text-lg">◈</span>

            <div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                Seus Créditos
              </div>

              <div className="text-sm font-black text-amber-400">
                {saldo}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CATEGORIAS
      ===================================================== */}
      {categorias.map((categoria) => {
        const itensCategoria = itensLoja.filter(
          (item) => item.categoria === categoria
        );

        return (
          <section
            key={categoria}
            className="rounded-2xl border border-amber-900/50 bg-[#11150f] p-4 shadow-xl"
          >
            {/* TÍTULO DA CATEGORIA */}
            <div className="mb-4 border-b border-amber-900/30 pb-3">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {categoria}
              </h2>

              <p className="mt-1 text-[9px] text-slate-600">
                {categoria === "Head" &&
                  "Cabelos, chapéus, capacetes e outros itens para a cabeça."}

                {categoria === "Skin" &&
                  "Roupas, uniformes e visuais para o aventureiro."}

                {categoria === "Buddy" &&
                  "Companheiros que poderão acompanhar sua jornada."}
              </p>
            </div>

            {/* ITENS */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {itensCategoria.map((item) => {
                const comprado = itensComprados.includes(item.id);
                const podeComprar = saldo >= item.preco && !comprado;

                return (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-xl border transition ${
                      comprado
                        ? "border-emerald-900/50 bg-emerald-950/10"
                        : "border-slate-800 bg-black/30"
                    }`}
                  >
                    {/* PREVIEW */}
                    <div className="flex h-36 items-center justify-center bg-black/30">
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={item.nome}
                          className="h-full w-full object-contain p-3"
                        />
                      ) : (
                        <div className="text-4xl opacity-30">?</div>
                      )}
                    </div>

                    {/* INFORMAÇÕES */}
                    <div className="p-3">
                      <div className="text-xs font-black text-white">
                        {item.nome}
                      </div>

                      <div className="mt-1 min-h-[28px] text-[9px] leading-relaxed text-slate-500">
                        {item.descricao}
                      </div>

                      {/* PREÇO */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-amber-500">◈</span>

                          <span className="text-xs font-black text-amber-400">
                            {item.preco}
                          </span>
                        </div>

                        {/* BOTÃO */}
                        {comprado ? (
                          <span className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-3 py-2 text-[8px] font-black uppercase tracking-wider text-emerald-400">
                            Adquirido
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={!podeComprar}
                            onClick={() => onComprar(item)}
                            className={`rounded-lg px-3 py-2 text-[8px] font-black uppercase tracking-wider transition ${
                              podeComprar
                                ? "border border-amber-700 bg-amber-950/40 text-amber-400 hover:bg-amber-900/50"
                                : "cursor-not-allowed border border-slate-800 bg-slate-900/40 text-slate-600"
                            }`}
                          >
                            {saldo < item.preco
                              ? "Sem créditos"
                              : "Comprar"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
