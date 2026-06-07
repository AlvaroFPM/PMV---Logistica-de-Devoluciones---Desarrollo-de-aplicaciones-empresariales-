interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="flex items-center gap-3 bg-emerald-700 text-white px-6 py-4 rounded-xl shadow-2xl text-sm font-medium min-w-[320px] justify-center">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  );
}
