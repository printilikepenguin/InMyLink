'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import './component/schedule.css';
import BlockHeader from '../components/block-header';
import PreblockCalendarOne from '../components/preview/preblock-cal-one';
import PreblockCalendarTwo from '../components/preview/preblock-cal-two';
import useBlockStore from 'store/useBlockStore';
import { useBlockSubmit } from 'hooks/useBlockSubmit';

export default function CalendarBlock() {
    const [dataSet, setDataSet] = useState<boolean>(false);
    const { blocks } = useBlockStore();
    const { paramsId } = useBlockSubmit();
    const [isListView, setIsListView] = useState(true);
    const [viewTypeNow, setViewTypeNow] = useState(true);

    // isListView true이면 캘린더블록 스타일 1, false면 스타일 2로 업데이트 ㅠㅠ
    // useEffect(() => {
    //     if (isListView) {
    //         updateCalBlock;
    //     } else {
    //         updateCalBlock;
    //     }
    // }, [isListView]);

    useEffect(() => {
        if (blocks) {
            setDataSet(true);
        } else {
            setDataSet(false);
        }
    }, [blocks]);

    return (
        <>
            <BlockHeader
                windowIcon={'/assets/icons/icon_close.png'}
                iconLink={'/admin'}
                blockTitle={'캘린더 블록'}
                blockDescription={`진행/예정된 일정이 1개 이상이어야
                  <br>
                  캘린더 블록을 공개할 수 있습니다`}
            />
            <div className="px-10">
                <Link
                    href={
                        paramsId
                            ? `/admin/block/calendar/form?paramsId=${paramsId}`
                            : '/admin/block/calendar/form'
                    }
                >
                    <button className="button color">
                        + 캘린더에 일정을 추가하세요
                    </button>
                </Link>
            </div>

            <div className="mb-10 h-3 w-full bg-gray-100" />

            <div className="px-10">
                <div>
                    <p className="mb-4 text-2xl font-semibold text-gray-700">
                        스타일설정
                    </p>
                    <div className="mb-4 flex flex-wrap">
                        <div className="flex gap-4">
                            <div
                                className="flex cursor-pointer"
                                onClick={() => setIsListView(true)}
                            >
                                <div
                                    className={`circle mr-2 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                        isListView
                                            ? 'bg-background border-4 border-orange-500'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div
                                        className={`button-color h-3 w-3 rounded-full ${
                                            isListView
                                                ? 'border-2 border-white bg-primary'
                                                : ''
                                        }`}
                                    ></div>
                                </div>
                                <div>리스트뷰</div>
                            </div>
                            <div
                                className="flex cursor-pointer"
                                onClick={() => setIsListView(false)}
                            >
                                <div
                                    className={`circle mr-2 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                        !isListView
                                            ? 'bg-background border-4 border-primary'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div
                                        className={`button-color h-3 w-3 rounded-full ${
                                            !isListView
                                                ? 'border-2 border-white bg-primary'
                                                : ''
                                        }`}
                                    ></div>
                                </div>
                                <div>캘린더뷰</div>
                            </div>
                        </div>
                    </div>

                    {isListView ? (
                        <div className="relative z-20 mx-auto flex w-full flex-col gap-10">
                            <PreblockCalendarOne flag={1} />
                        </div>
                    ) : (
                        <PreblockCalendarTwo />
                    )}
                </div>
            </div>

            <div className="my-10 w-full border" />

            <p className="mb-5 px-10 text-2xl font-semibold text-gray-700">
                추가된 모든 일정
            </p>
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4 border-b px-10 text-2xl font-semibold">
                    {/* 진행/예정된 일정 버튼 */}
                    <div
                        onClick={() => setViewTypeNow(true)}
                        className={`cursor-pointer pb-2 ${
                            viewTypeNow === true
                                ? 'border-b border-primary text-primary'
                                : 'text-gray-400'
                        }`}
                    >
                        진행/ 정된
                    </div>
                    <div
                        onClick={() => setViewTypeNow(false)}
                        className={`cursor-pointer pb-2 ${
                            viewTypeNow === false
                                ? 'border-b border-primary text-primary'
                                : 'text-gray-400'
                        }`}
                    >
                        지난
                    </div>
                </div>
                <div className="mb-5 h-[20rem] overflow-y-scroll px-10 py-5 [&::-webkit-scrollbar]:hidden">
                    {viewTypeNow === true ? (
                        //  데이터세트 들어오면 로직 수정
                        dataSet === true ? (
                            <PreblockCalendarOne flag={2} />
                        ) : (
                            <div className="min-h-1/2 flex w-full flex-1 flex-col items-center justify-center rounded-md bg-gray-100 p-12">
                                <p className="text-center">
                                    표시할 블록이 없습니다.
                                    <br />+ 버튼을 눌러서{' '}
                                    <strong>블록을 추가</strong>
                                    해보세요!
                                </p>
                                <Image
                                    src={'/assets/icons/icon_calendar.png'}
                                    alt="no schedule"
                                    width={50}
                                    height={50}
                                />
                            </div>
                        )
                    ) : (
                        <>
                            <div className="min-h-1/2 flex w-full flex-1 flex-col items-center justify-center rounded-md bg-gray-100 p-12">
                                <p className="text-center">
                                    표시할 블록이 없습니다.
                                    <br />+ 버튼을 눌러서{' '}
                                    <strong>블록을 추가</strong>
                                    해보세요!
                                </p>
                                <Image
                                    src={'/assets/icons/icon_calendar.png'}
                                    alt="no schedule"
                                    width={50}
                                    height={50}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
