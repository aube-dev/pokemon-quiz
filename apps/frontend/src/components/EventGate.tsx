import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { api_getEventConfig } from '@/apis/event';
import { queryClient } from '@/core/api/tanstackQuery';

interface EventGateProps {
    children: React.ReactNode;
}

export function EventGate({ children }: EventGateProps) {
    const [isEventOpen, setIsEventOpen] = useState<boolean | null>(null);
    const [eventTimes, setEventTimes] = useState<{ start: string; end: string } | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const config = await queryClient.fetchQuery({
                    ...api_getEventConfig.queryOptions(null),
                });

                setEventTimes({
                    start: config.eventStartTime,
                    end: config.eventEndTime
                });

                const start = new Date(config.eventStartTime);
                const end = new Date(config.eventEndTime);

                const checkTime = () => {
                    const now = new Date();
                    const isOpen = now >= start && now <= end;
                    setIsEventOpen(isOpen);
                };

                checkTime();
                const interval = setInterval(checkTime, 60000);
                return () => clearInterval(interval);
            } catch (error) {
                console.error('Failed to fetch event config:', error);
                setIsEventOpen(false);
            }
        };

        fetchConfig();
    }, []);

    if (isEventOpen === null) {
        return null; // Loading state
    }

    if (!isEventOpen) {
        const formatDateTime = (dateStr: string) => {
            return format(new Date(dateStr), 'M월 d일 a h시', { locale: ko });
        };

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">이벤트 기간이 아닙니다</h1>
                    <p className="mb-6 text-gray-700">
                        포동포동 퀴즈 이벤트는<br />
                        {eventTimes ? (
                            <>
                                <strong>{formatDateTime(eventTimes.start)} ~ {formatDateTime(eventTimes.end)}</strong>에만<br />
                            </>
                        ) : (
                            <><strong>지정된 시간</strong>에만<br /></>
                        )}
                        참여하실 수 있습니다.
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        홈으로 돌아가기
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
