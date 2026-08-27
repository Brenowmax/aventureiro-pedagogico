"use client";

import { useMemo, useState } from "react";

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "Acadêmico" | "Guilda" | "Evento" | "Objetivo";
  icon: string;
};

const initialEvents: CalendarEvent[] = [
  {
    id: "inicio-bimestre",
    date: "2026-08-03",
    title: "Início do 3º Bimestre",
    description: "Início do novo período acadêmico.",
    type: "Acadêmico",
    icon: "📚",
  },
  {
    id: "evento-guilda",
    date: "2026-08-25",
    title: "Conselho da Guilda",
    description: "Encontro e acompanhamento dos aventureiros.",
    type: "Guilda",
    icon: "⚔️",
  },
  {
    id: "objetivo-mensal",
    date: "2026-08-28",
    title: "Prazo de Objetivos Mensais",
    description:
      "Data limite para conclusão dos objetivos mensais.",
    type: "Objetivo",
    icon: "🎯",
  },
  {
    id: "prova",
    date: "2026-09-04",
    title: "Avaliação de Matemática",
    description:
      "Avaliação do componente curricular de Matemática.",
    type: "Acadêmico",
    icon: "📝",
  },
  {
    id: "evento-especial",
    date: "2026-09-12",
    title: "Festival da Guilda",
    description:
      "Evento especial com atividades e recompensas.",
    type: "Evento",
    icon: "🎉",
  },
];

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const weekDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export default function CalendarioGuilda() {
  const today = new Date();

  const todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] =
    useState(todayString);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const calendarDays = useMemo(() => {
    const days: Array<number | null> = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  const eventsThisMonth = initialEvents.filter(
    (event) => {
      const eventDate = new Date(
        `${event.date}T12:00:00`
      );

      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month
      );
    }
  );

  const selectedEvents = initialEvents.filter(
    (event) => event.date === selectedDate
  );

  function formatDate(day: number) {
    return `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  }

  function changeMonth(amount: number) {
    setCurrentDate(
      new Date(year, month + amount, 1)
    );
  }

  function goToToday() {
    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setSelectedDate(todayString);
  }

  function getEventTypeClass(
    type: CalendarEvent["type"]
  ) {
    switch (type) {
      case "Acadêmico":
        return "border-blue-800/50 bg-blue-950/30 text-blue-300";

      case "Guilda":
        return "border-purple-800/50 bg-purple-950/30 text-purple-300";

      case "Evento":
        return "border-amber-800/50 bg-amber-950/30 text-amber-300";

      case "Objetivo":
        return "border-emerald-800/50 bg-emerald-950/30 text-emerald-300";
    }
  }

  return (
    <div className="space-y-6">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="rounded-3xl border border-indigo-800/50 bg-gradient-to-br from-[#171a3d] via-[#101329] to-[#080a14] p-6 shadow-2xl sm:p-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-500/40 bg-amber-950/30 text-4xl shadow-[0_0_25px_rgba(245,158,11,0.15)]">
              📅
            </div>

            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400">
                Calendário da Guilda
              </div>

              <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                Os Acontecimentos do Reino
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
                Acompanhe avaliações, objetivos,
                eventos e acontecimentos importantes
                da jornada.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={goToToday}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-amber-300 transition hover:bg-amber-500/20"
          >
            📜 Ir para Hoje
          </button>

        </div>

      </div>

      {/* =====================================================
          CALENDÁRIO + DIÁRIO
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">

        {/* ===================================================
            CALENDÁRIO
        =================================================== */}

        <div className="rounded-3xl border border-slate-800 bg-[#0d110c] p-4 shadow-xl sm:p-6">

          {/* Cabeçalho do mês */}

          <div className="mb-6 flex items-center justify-between gap-3">

            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-lg text-slate-300 transition hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300"
              title="Mês anterior"
            >
              ◀
            </button>

            <div className="text-center">

              <div className="text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
                {monthNames[month]}
              </div>

              <div className="mt-1 text-xs font-bold text-amber-400">
                {year}
              </div>

            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-lg text-slate-300 transition hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300"
              title="Próximo mês"
            >
              ▶
            </button>

          </div>

          {/* =================================================
              ÁREA VISUAL DO CALENDÁRIO
          ================================================= */}

          <div
            className="relative overflow-hidden rounded-2xl border border-amber-900/40 bg-[#11150f]"
            style={{
              aspectRatio: "16 / 10",
            }}
          >

            {/* FUNDO PNG */}

            <img
              src="/images/calendario-guilda-fundo.png"
              alt="Calendário da Guilda"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />

            {/* CAMADA DE LEITURA */}

            <div className="pointer-events-none absolute inset-0 bg-black/[0.04]" />

            {/* =================================================
                GRADE DOS DIAS
            ================================================= */}

            <div className="relative z-10 grid h-full grid-cols-7 grid-rows-[auto_1fr] gap-1 p-[2.5%] sm:gap-2">

              {/* DIAS DA SEMANA */}

              {weekDays.map((day) => (
                <div
                  key={day}
                  className="flex items-end justify-center pb-1 text-center text-[7px] font-black uppercase tracking-wider text-slate-700 sm:text-[9px]"
                >
                  <span className="hidden sm:block">
                    {day}
                  </span>

                  <span className="sm:hidden">
                    {day.slice(0, 3)}
                  </span>
                </div>
              ))}

              {/* =================================================
                  DIAS DO MÊS
              ================================================= */}

              <div className="col-span-7 grid min-h-0 grid-cols-7 grid-rows-6 gap-1 sm:gap-2">

                {Array.from({
                  length: 42,
                }).map((_, index) => {

                  const day =
                    calendarDays[index] ?? null;

                  if (day === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="relative min-h-0 rounded-xl"
                      />
                    );
                  }

                  const date = formatDate(day);

                  const dayEvents =
                    eventsThisMonth.filter(
                      (event) =>
                        event.date === date
                    );

                  const isSelected =
                    selectedDate === date;

                  const isToday =
                    isCurrentMonth &&
                    date === todayString;

                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() =>
                        setSelectedDate(date)
                      }
                      className={`group relative min-h-0 overflow-visible rounded-xl p-1 text-left transition-all duration-200 ${
                        isSelected && !isToday
                          ? "bg-amber-500/[0.08] ring-1 ring-amber-500/40"
                          : "hover:bg-black/10"
                      }`}
                    >

                      {/* =================================================
                          MOLDURA DA DATA ATUAL
                      ================================================= */}

                      {isToday && (
                        <img
                          src="/images/calendario-data-atual.png"
                          alt=""
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-[-8%] z-20 h-[116%] w-[116%] object-contain"
                        />
                      )}

                      {/* =================================================
                          NÚMERO DO DIA
                      ================================================= */}

                      <div
                        className={`relative z-30 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black transition-all sm:h-8 sm:w-8 ${
                          isToday
                            ? "text-amber-950"
                            : isSelected
                            ? "bg-slate-800/80 text-white"
                            : "text-slate-800 group-hover:text-black"
                        }`}
                      >
                        {day}
                      </div>

                      {/* =================================================
                          EVENTOS
                      ================================================= */}

                      {dayEvents.length > 0 && (
                        <div className="relative z-30 mt-1 space-y-1">

                          {dayEvents
                            .slice(0, 2)
                            .map((event) => (
                              <div
                                key={event.id}
                                className={`rounded-md border px-1 py-0.5 shadow-sm ${getEventTypeClass(
                                  event.type
                                )}`}
                              >
                                <div className="flex items-center gap-1">

                                  <span className="shrink-0 text-[10px]">
                                    {event.icon}
                                  </span>

                                  <span className="truncate text-[7px] font-black leading-3 sm:text-[8px]">
                                    {event.title}
                                  </span>

                                </div>
                              </div>
                            ))}

                          {dayEvents.length > 2 && (
                            <div className="text-[7px] font-bold text-slate-700">
                              +{dayEvents.length - 2}
                            </div>
                          )}

                        </div>
                      )}

                      {/* INDICADOR DE EVENTO */}

                      {dayEvents.length > 0 && (
                        <span className="absolute right-1 top-1 z-40 h-1.5 w-1.5 rounded-full bg-amber-500 opacity-80" />
                      )}

                    </button>
                  );
                })}

              </div>

            </div>

          </div>

          {/* =================================================
              RODAPÉ
          ================================================= */}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">

            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">

              <div className="relative h-5 w-5">
                <img
                  src="/images/calendario-data-atual.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                />

                <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-amber-950">
                  26
                </span>
              </div>

              Hoje

            </div>

            <div className="text-[9px] font-bold text-slate-600">
              Clique em um dia para consultar a agenda
            </div>

          </div>

        </div>

        {/* ===================================================
            DIÁRIO DA GUILDA
        =================================================== */}

        <div className="rounded-3xl border border-slate-800 bg-[#0d110c] p-5 shadow-xl sm:p-6">

          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-800/50 bg-purple-950/30 text-2xl">
              📜
            </div>

            <div>

              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
                Diário da Guilda
              </div>

              <h4 className="mt-1 text-lg font-black text-white">
                {selectedDate === todayString
                  ? "Hoje"
                  : selectedDate
                      .split("-")
                      .reverse()
                      .join("/")}
              </h4>

            </div>

          </div>

          <div className="mt-5 space-y-3">

            {selectedEvents.map((event) => (

              <div
                key={event.id}
                className={`rounded-2xl border p-4 ${getEventTypeClass(
                  event.type
                )}`}
              >

                <div className="flex items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/20 text-2xl">
                    {event.icon}
                  </div>

                  <div className="min-w-0">

                    <div className="text-xs font-black">
                      {event.title}
                    </div>

                    <div className="mt-2 text-[10px] leading-5 opacity-80">
                      {event.description}
                    </div>

                    <div className="mt-3 inline-flex rounded-lg border border-current/20 bg-black/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider">
                      {event.type}
                    </div>

                  </div>

                </div>

              </div>

            ))}

            {!selectedEvents.length && (

              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 p-6 text-center">

                <div className="text-5xl opacity-60">
                  🏕️
                </div>

                <div className="mt-4 text-sm font-black text-slate-300">
                  Nenhum acontecimento
                </div>

                <div className="mt-2 max-w-[220px] text-[10px] leading-5 text-slate-500">
                  Nenhum registro foi encontrado
                  para esta data. Escolha outro dia
                  no calendário.
                </div>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          LEGENDA
      ===================================================== */}

      <div className="rounded-3xl border border-slate-800 bg-[#0d110c] p-5 sm:p-6">

        <div className="flex items-center gap-3">

          <div className="text-xl">
            🗺️
          </div>

          <div>

            <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
              Categorias
            </div>

            <div className="mt-1 text-xs font-bold text-slate-400">
              Tipos de acontecimentos da Guilda
            </div>

          </div>

        </div>

        <div className="mt-4 flex flex-wrap gap-2">

          {(
            [
              ["Acadêmico", "📚"],
              ["Guilda", "⚔️"],
              ["Evento", "🎉"],
              ["Objetivo", "🎯"],
            ] as const
          ).map(([type, icon]) => (

            <span
              key={type}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold ${getEventTypeClass(
                type
              )}`}
            >

              <span className="text-base">
                {icon}
              </span>

              {type}

            </span>

          ))}

        </div>

      </div>

    </div>
  );
}