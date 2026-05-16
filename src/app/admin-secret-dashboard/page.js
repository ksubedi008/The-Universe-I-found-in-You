import { prisma } from "@/lib/prisma";
import { createMessage, deleteMessage, createMemory, deleteMemory } from "./actions";
import { Trash2, Image as ImageIcon, MessageSquare, PlusCircle } from "lucide-react";

export const metadata = {
  title: "Universe Admin",
};

export default async function AdminDashboard() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" }
  });
  
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="border-b border-white/10 pb-8">
          <h1 className="text-4xl font-serif text-white/90">Universe Admin</h1>
          <p className="text-white/50 mt-2">Manage the elements of your universe.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Messages Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <MessageSquare className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-serif">Stars of Reasons</h2>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-white/50" /> Add New Reason
              </h3>
              <form action={createMessage} className="space-y-4">
                <textarea 
                  name="content"
                  required
                  placeholder="I love you because..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-colors resize-none h-32"
                />
                <button type="submit" className="w-full py-3 px-4 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 rounded-xl font-medium transition-all">
                  Create Star
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/70">Existing Stars ({messages.length})</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex justify-between items-start gap-4 hover:bg-white/10 transition-colors">
                    <p className="text-white/80 text-sm leading-relaxed">{msg.content}</p>
                    <form action={deleteMessage.bind(null, msg.id)}>
                      <button type="submit" className="p-2 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-white/30 italic text-sm">No stars added yet.</p>}
              </div>
            </div>
          </section>

          {/* Memories Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ImageIcon className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-serif">Memory Lake</h2>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-white/50" /> Add New Memory
              </h3>
              <form action={createMemory} className="space-y-4">
                <input 
                  type="text"
                  name="title"
                  required
                  placeholder="Memory Title"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <textarea 
                  name="description"
                  placeholder="The story behind this memory..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors resize-none h-24"
                />
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    name="image"
                    accept="image/*"
                    className="flex-1 text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 file:transition-colors file:cursor-pointer"
                  />
                </div>
                <button type="submit" className="w-full py-3 px-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl font-medium transition-all">
                  Drop Memory
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white/70">Existing Memories ({memories.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {memories.map(memory => (
                  <div key={memory.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden group">
                    {memory.imageUrl ? (
                      <div className="h-32 w-full bg-black/50 relative">
                        <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="h-32 w-full bg-black/50 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                    <div className="p-4 relative">
                      <h4 className="font-medium text-white/90">{memory.title}</h4>
                      {memory.description && <p className="text-white/50 text-xs mt-1 line-clamp-2">{memory.description}</p>}
                      <form action={deleteMemory.bind(null, memory.id)} className="absolute top-4 right-4">
                        <button type="submit" className="p-1.5 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 bg-black/50 backdrop-blur-md">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
                {memories.length === 0 && <p className="text-white/30 italic text-sm col-span-2">No memories dropped yet.</p>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
