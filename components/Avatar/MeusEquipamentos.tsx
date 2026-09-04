"use client";

type MeusEquipamentosProps = {
equipamentoHead?: string;
equipamentoSkin?: string;
equipamentoBuddy?: string;

itensComprados: string[];

onEquiparHead: (src: string | undefined) => void;
onEquiparSkin: (src: string | undefined) => void;
onEquiparBuddy: (src: string | undefined) => void;
};

const equipamentos = {
head: [
{
id: "head-1",
nome: "Cabelo 1",
src: "/avatar/alinhados/Head1.png",
},
{
id: "head-2",
nome: "Cabelo 2",
src: "/avatar/alinhados/Head2.png",
},
],

skin: [
{
id: "skin-1",
nome: "Uniforme 1",
src: "/avatar/alinhados/Uniforme1.png",
},
],

buddy: [
{
id: "buddy-1",
nome: "Capy Capivara",
src: "/buddy/Capy%20Capivara.png",
},
],
};

export default function MeusEquipamentos({
equipamentoHead,
equipamentoSkin,
equipamentoBuddy,
itensComprados,
onEquiparHead,
onEquiparSkin,
onEquiparBuddy,
}: MeusEquipamentosProps) {
const headsComprados = equipamentos.head.filter((item) =>
itensComprados.includes(item.id)
);

const skinsCompradas = equipamentos.skin.filter((item) =>
itensComprados.includes(item.id)
);

const buddiesComprados = equipamentos.buddy.filter((item) =>
itensComprados.includes(item.id)
);

return ( <div className="w-full rounded-2xl border border-amber-900/50 bg-[#11150f] p-4 shadow-xl">
{/* CABEÇALHO */} <div className="mb-3 border-b border-amber-900/40 pb-2"> <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-500">
Meus Equipamentos </div>

```
    <div className="mt-1 text-[10px] text-slate-500">
      Itens disponíveis para o seu aventureiro
    </div>
  </div>

  {/* HEAD */}
  <section className="mb-4">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-xs font-black uppercase tracking-widest text-white">
        Head
      </h3>

      {equipamentoHead && (
        <button
          type="button"
          onClick={() => onEquiparHead(undefined)}
          className="text-[9px] font-bold uppercase text-slate-500 hover:text-amber-400"
        >
          Remover
        </button>
      )}
    </div>

    {headsComprados.length === 0 ? (
      <div className="rounded-xl border border-dashed border-slate-800 bg-black/20 p-4 text-center">
        <div className="text-xl opacity-30">+</div>

        <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
          Nenhum Head adquirido
        </div>

        <div className="mt-1 text-[8px] text-slate-600">
          Visite a Loja da Guilda para adquirir novos itens.
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-2">
        {headsComprados.map((item) => {
          const equipado = equipamentoHead === item.src;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onEquiparHead(item.src)}
              className={`rounded-xl border p-1.5 text-left transition ${
                equipado
                  ? "border-amber-500 bg-amber-950/40"
                  : "border-slate-800 bg-black/30 hover:border-amber-900"
              }`}
            >
              <div className="flex h-16 items-center justify-center rounded-lg bg-black/30">
                <img
                  src={item.src}
                  alt={item.nome}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-1.5 text-[8px] font-bold text-white">
                {item.nome}
              </div>

              {equipado && (
                <div className="mt-0.5 text-[7px] font-black uppercase text-amber-400">
                  Equipado
                </div>
              )}
            </button>
          );
        })}
      </div>
    )}
  </section>

  {/* SKIN */}
  <section className="mb-4">
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-xs font-black uppercase tracking-widest text-white">
        Skin
      </h3>

      {equipamentoSkin && (
        <button
          type="button"
          onClick={() => onEquiparSkin(undefined)}
          className="text-[9px] font-bold uppercase text-slate-500 hover:text-amber-400"
        >
          Remover
        </button>
      )}
    </div>

    {skinsCompradas.length === 0 ? (
      <div className="rounded-xl border border-dashed border-slate-800 bg-black/20 p-4 text-center">
        <div className="text-xl opacity-30">+</div>

        <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
          Nenhuma Skin adquirida
        </div>

        <div className="mt-1 text-[8px] text-slate-600">
          Visite a Loja da Guilda para adquirir novos visuais.
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-2">
        {skinsCompradas.map((item) => {
          const equipado = equipamentoSkin === item.src;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onEquiparSkin(item.src)}
              className={`rounded-xl border p-1.5 text-left transition ${
                equipado
                  ? "border-amber-500 bg-amber-950/40"
                  : "border-slate-800 bg-black/30 hover:border-amber-900"
              }`}
            >
              <div className="flex h-16 items-center justify-center rounded-lg bg-black/30">
                <img
                  src={item.src}
                  alt={item.nome}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-1.5 text-[8px] font-bold text-white">
                {item.nome}
              </div>

              {equipado && (
                <div className="mt-0.5 text-[7px] font-black uppercase text-amber-400">
                  Equipado
                </div>
              )}
            </button>
          );
        })}
      </div>
    )}
  </section>

  {/* BUDDY */}
  <section>
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-xs font-black uppercase tracking-widest text-white">
        Buddy
      </h3>

      {equipamentoBuddy && (
        <button
          type="button"
          onClick={() => onEquiparBuddy(undefined)}
          className="text-[9px] font-bold uppercase text-slate-500 hover:text-amber-400"
        >
          Remover
        </button>
      )}
    </div>

    {buddiesComprados.length === 0 ? (
      <div className="rounded-xl border border-dashed border-slate-800 bg-black/20 p-4 text-center">
        <div className="text-xl opacity-40">?</div>

        <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
          Nenhum Buddy disponível
        </div>

        <div className="mt-1 text-[8px] text-slate-600">
          Novos companheiros poderão ser adquiridos na Loja da Guilda.
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-2">
        {buddiesComprados.map((item) => {
          const equipado = equipamentoBuddy === item.src;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onEquiparBuddy(item.src)}
              className={`rounded-xl border p-1.5 text-left transition ${
                equipado
                  ? "border-amber-500 bg-amber-950/40"
                  : "border-slate-800 bg-black/30 hover:border-amber-900"
              }`}
            >
              <div className="flex h-16 items-center justify-center rounded-lg bg-black/30">
                <img
                  src={item.src}
                  alt={item.nome}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-1.5 text-[8px] font-bold text-white">
                {item.nome}
              </div>

              {equipado && (
                <div className="mt-0.5 text-[7px] font-black uppercase text-amber-400">
                  Equipado
                </div>
              )}
            </button>
          );
        })}
      </div>
    )}
  </section>
</div>

);
}