import { useState } from 'react';
import { FiImage, FiVideo, FiMusic } from 'react-icons/fi';

export default function Card({ title, image, video, audio }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-[280px] h-[400px] perspective-1000 cursor-pointer mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Face avant */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full rounded-xl bg-white shadow-xl border-8 border-white overflow-hidden">
            <div className="h-3/4 bg-gray-100">
              {image ? (
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiImage className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col justify-between h-1/4">
              <h3 className="font-bold text-lg truncate">{title}</h3>
              <div className="flex gap-2">
                {image && <FiImage className="w-5 h-5 text-blue-500" />}
                {video && <FiVideo className="w-5 h-5 text-green-500" />}
                {audio && <FiMusic className="w-5 h-5 text-purple-500" />}
              </div>
            </div>
          </div>
        </div>

        {/* Face arrière */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full rounded-xl bg-white shadow-xl border-8 border-white overflow-hidden flex flex-col">
            {video && (
              <div className="flex-1">
                <video controls className="w-full h-full object-cover">
                  <source src={video} type="video/mp4" />
                </video>
              </div>
            )}
            {audio && !video && (
              <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                <audio controls className="w-full">
                  <source src={audio} type="audio/mpeg" />
                </audio>
              </div>
            )}
            {!video && !audio && (
              <div className="flex-1 bg-gray-100 flex items-center justify-center text-gray-400">
                <span className="text-lg">Aucun média</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}