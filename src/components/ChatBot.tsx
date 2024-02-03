import React, { useTransition } from "react";
import translate from "@/i18n/translate.json";

export default function ChatBot({ lang = "es" }: { lang: Languages }) {
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<
    {
      id: string;
      content: string;
      sender: "bot" | "user";
    }[]
  >([
    {
      id: "1",
      content: translate[lang].chatBot["first-message"],
      sender: "bot",
    },
  ]);

  const handleSendMessage = async (evt: React.ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.target);
    const question = formData.get("question");
    if (!question) {
      return;
    }
    setLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Math.random().toString(36).slice(2), content: question as string, sender: "user" },
    ]);

    const answer = await sendMessage(question as string);
    setMessages((prevMessages) => [...prevMessages, { id: Math.random().toString(36).slice(2), content: answer, sender: "bot" }]);

    evt.target.reset();
    setLoading(false);
  };
  async function sendMessage(question: string) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
        import.meta.env.PUBLIC_GEMINI_API_KEY
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpull assistant that asnwers questions  about Lionel Farias as you were him. \nNote: Questions can be both english or spanish, answer according to the language that the question is asked\n\n\n\nSome information about Lionel Farias:\n\nMi nombre es Lionel Farias, tengo 18 años y actualmente vivo en Argentina.  \n\nEstudios: \n\nSoy Técnico en Informática y actualmente estoy estudiando Ingeniería en Informática. \n\nProyectos: \n\nHice varios proyectos personales, entre esos se encuentran:\n\nDaily Events: Una aplicación para crear y organizar eventos desde cualquier parte. Está desarrollado con Nextjs, Tailwind y Clerk.\n\nUrl Shortener: Un acortador de links para tus paginas web. Desarrollado con Nextjs, Tailwind y NextAuth.\n\nScratch.io: Una página de dibujo en tiempo real para que pases el tiempo con tus amigos. Desarrollado con Nextjs, Shadcn ui, Tailwind y Socket.io.\n\nSistema de suplencias cortas: Sistema para administrar el sitema de suplencias a corto plazo en las instituciones educativas.\n\n\n\n\n\nMy name is Lionel Farias, I'\''m 18 years old, and currently, I live in Argentina.\n\n\nEducation:\nI am a Computer Technician, and I am currently studying Computer Engineering.\n\nProjects:\nI have worked on several personal projects, including:\n\nDaily Events:\nAn application for creating and organizing events from anywhere.\nDeveloped with Next.js, Tailwind, and Clerk.\n\nURL Shortener:\nA link shortener for your web pages.\nDeveloped with Next.js, Tailwind, and NextAuth.\n\nScratch.io:\nA real-time drawing page to spend time with your friends.\nDeveloped with Next.js, Shadcn UI, Tailwind, and Socket.io.\n\nShort-term Substitution System:\nA system for managing short-term substitutions in educational institutions.\n\n----\n\n\nQuestion:${question} \nAnswer: \n\n`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
            stopSequences: [],
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    )
      .then((res) => res.json() as Promise<{ candidates: { content: { parts: { text: string }[] } }[] }>)
      .then((data) => data.candidates[0].content.parts[0].text);

    return response;
  }

  return (
    <div className="mx-auto w-full ">
      <div className="my-2 flex flex-col bg-black-3 border border-[#ffffff4b] mx-auto max-w-lg h-64 relative mr-4 rounded-md overflow-hidden z-30">
        <main className="space-y-2 p-2 flex flex-col overflow-x-hidden overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`w-fit max-w-[80%] text-sm inline-block bg-[#37373762] rounded-md px-3 py-1 ${
                message.sender === "bot" ? "self-start" : "self-end opacity-50"
              }`}
            >
              <p>{message.content}</p>
            </div>
          ))}
        </main>
        <footer className="mt-auto p-2 border-t border-[#ffffff2e]">
          <form onSubmit={handleSendMessage} className="flex  items-center justify-center gap-2">
            <input
              type="text"
              name="question"
              placeholder={translate[lang].chatBot["example"]}
              aria-disabled={loading}
              disabled={loading}
              className={`${
                loading ? "blur-[1px] cursor-wait" : ""
              } rounded-md outline-none appearance-none bg-white/5 px-2 py-0.5 w-full border border-[#ffffff2e]`}
            />
            <button className="rounded-md border border-[#ffffff14] text-sm px-2">
              {loading ? translate[lang].chatBot["load"] : translate[lang].chatBot["send"]}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
