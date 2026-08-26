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
    icon: "🏰",
  },
  {
    id: "objetivo-mensal",
    date: "2026-08-28",
    title: "Prazo de Objetivos Mensais",
    description: "Data limite para conclusão dos objetivos mensais.",
    type: "Objetivo",
    icon: "🎯",
  },
  {
    id: "prova",
    date: "2026-09-04",
    title: "Avaliação de Matemática",
    description: "Avaliação do componente curricular de Matemática.",
    type: "Acadêmico",
    icon: "📐",
  },
  {
    id: "evento-especial",
    date: "2026-09-12",
    title: "Festival da Guilda",
    description: "Evento especial com atividades e recompensas.",
    type: "Evento",
    icon: "⚔️",
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

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CalendarioGuilda() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().slice(0, 10)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  const eventsThisMonth = initialEvents.filter((event) => {
    const eventDate = new Date(`${event.date}T12:00:00`);

    return (
      eventDate.getFullYear() === year &&
      eventDate.getMonth() === month
    );
  });

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

  function getEventTypeClass(type: CalendarEvent["type"]) {
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
    <div className="space-y-5">
      <div>
        <div className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">
          Calendário da Guilda
        </div>

        <h3 className="mt-1 text-2xl font-black text-white">
          Agenda do Aventureiro
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Acompanhe avaliações, objetivos, eventos e
          compromissos importantes da jornada.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
            >
              ←
            </button>

            <div className="text-center">
              <div className="text-lg font-black text-white">
                {monthNames[month]}
              </div>

              <div className="text-[10px] font-bold text-slate-500">
                {year}
              </div>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-300 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-300"
            >
              →
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[9px] font-black uppercase tracking-wider text-slate-600"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-20 rounded-xl"
                  />
                );
              }

              const date = formatDate(day);

              const dayEvents = eventsThisMonth.filter(
                (event) => event.date === date
              );

              const isSelected =
                selectedDate === date;

              const isToday =
                date ===
                today.toISOString().slice(0, 10);

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-20 rounded-xl border p-2 text-left transition ${
                    isSelected
                      ? "border-amber-500/60 bg-amber-500/10"
                      : "border-slate-800 bg-slate-950/40 hover:border-slate-600 hover:bg-slate-900"
                  }`}
                >
                  <div
                    className={`text-xs font-black ${
                      isToday
                        ? "text-amber-300"
                        : "text-slate-400"
                    }`}
                  >
                    {day}
                  </div>

                  <div className="mt-2 space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="truncate text-[9px] font-bold text-slate-300"
                        title={event.title}
                      >
                        {event.icon} {event.title}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
            Diário da Guilda
          </div>

          <h4 className="mt-1 text-lg font-black text-white">
            {selectedDate ===
            today.toISOString().slice(0, 10)
              ? "Hoje"
              : selectedDate.split("-").reverse().join("/")}
          </h4>

          <div className="mt-5 space-y-3">
            {selectedEvents.map((event) => (
              <div
                key={event.id}
                className={`rounded-xl border p-4 ${getEventTypeClass(
                  event.type
                )}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {event.icon}
                  </span>

                  <div>
                    <div className="text-xs font-black">
                      {event.title}
                    </div>

                    <div className="mt-1 text-[10px] leading-5 opacity-80">
                      {event.description}
                    </div>

                    <div className="mt-2 text-[9px] font-black uppercase tracking-wider opacity-70">
                      {event.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!selectedEvents.length && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center">
                <div className="text-3xl">
                  🗺️
                </div>

                <div className="mt-3 text-xs font-black text-slate-300">
                  Nenhum evento neste dia
                </div>

                <div className="mt-1 text-[10px] leading-5 text-slate-500">
                  Selecione outra data para
                  consultar a agenda.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#11150f] p-5">
        <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
          Legenda
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["Acadêmico", "📚"],
              ["Guilda", "🏰"],
              ["Evento", "⚔️"],
              ["Objetivo", "🎯"],
            ] as const
          ).map(([type, icon]) => (
            <span
              key={type}
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold ${getEventTypeClass(
                type
              )}`}
            >
              {icon} {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
