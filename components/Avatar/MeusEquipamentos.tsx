"use client";

type MeusEquipamentosProps = {
  equipamentoHead?: string;
  equipamentoSkin?: string;
  equipamentoBuddy?: string;
  onEquiparHead: (src: string | undefined) => void;
  onEquiparSkin: (src: string | undefined) => void;
  onEquiparBuddy: (src: string | undefined) => void;
};

const equipamentos = {
  head: [
    {
      nome: "Cabelo 1",
      src: "/head/Head1.png",
    },
    {
      nome: "Cabelo 2",
      src: "/head/Head2.png",
    },
  ],
  skin: [
    {
      nome: "Uniforme 1",
      src: "/skin/Uniforme1.png",
    },
  ],
};

export default function MeusEquipamentos({
  equipamentoHead,
  equipamentoSkin,
  equipamentoBuddy,
  onEquiparHead,
  onEquiparSkin,
  onEquiparBuddy,
}: MeusEquipamentosProps) {
  return (
    <div className="w-full rounded-2xl border border-amber-900/50 bg-[#11150f] p-4 shadow-xl">
      <div className="mb-4 border-b border-amber-900/40 pb-3">
        <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-500">
          Meus Equipamentos
        </div>

        <div className="mt-1 text-[10px] text-slate-500">
          Itens disponíveis para o seu aventureiro
        </div>
      </div>

      {/* HEAD */}
      <section className="mb-5">
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

        <div className="grid grid-cols-2 gap-2">
          {equipamentos.head.map((item) => {
            const equipado = equipamentoHead === item.src;

            return (
              <button
                key={item.src}
                type="button"
                onClick={() => onEquiparHead(item.src)}
                className={`rounded-xl border p-2 text-left transition ${
                  equipado
                    ? "border-amber-500 bg-amber-950/40"
                    : "border-slate-800 bg-black/30 hover:border-amber-900"
                }`}
              >
                <div className="flex h-24 items-center justify-center rounded-lg bg-black/30">
                  <img
                    src={item.src}
                    alt={item.nome}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-2 text-[9px] font-bold text-white">
                  {item.nome}
                </div>

                {equipado && (
                  <div className="mt-1 text-[8px] font-black uppercase text-amber-400">
                    Equipado
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* SKIN */}
      <section className="mb-5">
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

        <div className="grid grid-cols-2 gap-2">
          {equipamentos.skin.map((item) => {
            const equipado = equipamentoSkin === item.src;

            return (
              <button
                key={item.src}
                type="button"
                onClick={() => onEquiparSkin(item.src)}
                className={`rounded-xl border p-2 text-left transition ${
                  equipado
                    ? "border-amber-500 bg-amber-950/40"
                    : "border-slate-800 bg-black/30 hover:border-amber-900"
                }`}
              >
                <div className="flex h-24 items-center justify-center rounded-lg bg-black/30">
                  <img
                    src={item.src}
                    alt={item.nome}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-2 text-[9px] font-bold text-white">
                  {item.nome}
                </div>

                {equipado && (
                  <div className="mt-1 text-[8px] font-black uppercase text-amber-400">
                    Equipado
                  </div>
                )}
              </button>
            );
          })}
        </div>
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

        <div className="rounded-xl border border-dashed border-slate-800 bg-black/20 p-5 text-center">
          <div className="text-2xl opacity-40">?</div>

          <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Nenhum Buddy disponível
          </div>

          <div className="mt-1 text-[9px] text-slate-600">
            Novos companheiros poderão ser adquiridos na Loja da Guilda.
          </div>
        </div>
      </section>
    </div>
  );
}