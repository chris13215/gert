import { AIModel } from '../types';

interface ModelGridProps {
  models: AIModel[];
  onSelectModel: (modelId: string) => void;
}

export default function ModelGrid({ models, onSelectModel }: ModelGridProps) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-app)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-robotic text-gradient">
            AI Nigga
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Choose your AI assistant to start chatting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="model-card glass rounded-2xl p-6 cursor-pointer group relative"
              onClick={() => onSelectModel(model.id)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(59, 130, 246, 0.05))',
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {model.icon}
                  </div>
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      background: 'rgba(124, 58, 237, 0.2)',
                      color: 'var(--accent-primary)',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                    }}
                  >
                    {model.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
                  {model.name}
                </h3>

                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {model.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                    by {model.provider}
                  </span>
                  <button
                    className="btn-ripple px-4 py-2 rounded-lg font-medium text-sm text-white transition-all"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'brightness(1.1)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'brightness(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Launch Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
