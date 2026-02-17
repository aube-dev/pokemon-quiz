import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { api_getEventConfig } from '@/apis/event';
import { queryClient } from '@/core/api/tanstackQuery';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface EventGateProps {
    children: React.ReactNode;
}

export function EventGate({ children }: EventGateProps) {
    const [isEventOpen, setIsEventOpen] = useState<boolean | null>(null);
    const [eventTimes, setEventTimes] = useState<{ start: string; end: string } | null>(null);

    const navigate = useNavigate()

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
                <Card className="w-full text-center">
                    <CardContent>
                        <CardTitle className="text-2xl font-bold mb-4 text-red-600">이벤트 기간이 아닙니다</CardTitle>
                        <CardDescription>
                            포동포동 퀴즈 이벤트는<br />
                            {eventTimes ? (
                                <>
                                    <strong>{formatDateTime(eventTimes.start)} ~ {formatDateTime(eventTimes.end)}</strong>에<br />
                                </>
                            ) : (
                                <><strong>지정된 시간</strong>에<br /></>
                            )}
                            참여하실 수 있습니다.
                        </CardDescription>
                    </CardContent>

                    <CardFooter className='w-full self-center'>
                        <Button
                            onClick={() => navigate({ to: '/leaderboard' })}
                            className="font-bold w-full py-2 px-4 rounded transition duration-200 cursor-pointer"
                        >
                            리더보드 보러가기
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
}
