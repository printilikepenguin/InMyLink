'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Empty from './components/empty';
import { ReactSortable, SortableEvent } from 'react-sortablejs';
import Block from './components/block';
import BlockLink from './components/block-link';
import { ClientRoute } from '@config/route';
import { useRouter } from 'next/navigation';
import {
    fetchBlockList,
    fetchUserInfo,
    fetchVisitorInfo,
    updateBlockOrder,
    updatePrivate,
} from 'service/api/admin-api';
import Skeleton from './components/skeleton';
import useBlockStore from 'store/useBlockStore';
import PreviewPage from '@components/preview-page';
import HowtoModal from '@components/howto-modal';

export default function Admin() {
    const { blocks, setBlocks } = useBlockStore();
    const [token, setToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [visitorInfo, setVisitorInfo] = useState<Visitor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isBlockLinkOpen, setIsBlockLinkOpen] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [howtoModalOpen, setHowtoModalOpen] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [movingState, setMovingState] = useState<{
        index: number | null;
        action: 'UP' | 'DOWN' | null;
    }>({ index: null, action: null });

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push(ClientRoute.LOGIN as string);
        }
        setToken(token);

        fetchData(token);
    }, []);
    const fetchData = async (token: string) => {
        if (token) {
            try {
                const [userData, blockData, visitorData] = await Promise.all([
                    fetchUserInfo(token),
                    fetchBlockList(token),
                    fetchVisitorInfo(token),
                ]);

                setBlocks(blockData);
                setUserInfo(userData);
                setVisitorInfo(visitorData);
                setIsPrivate(userData.privateYn === 'Y');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    // 드래그 중 실행
    const updateBlock = (blocks: Block[], from: number, to: number) => {
        const list = [...blocks];
        const item = list.splice(from, 1);
        list.splice(to, 0, ...item);
        const sortedList = list.map((block, i) => {
            block.sequence = i;
            return block;
        });
        if (token) {
            const result = updateBlockOrder(token, sortedList); // 결과를 처리할 수 있도록 수정
            if (result) {
                console.log('Block order updated');
            }
        }
        setBlocks(sortedList);
    };

    // 드래그 끝났을 때 실행
    const dragEnd = (e: SortableEvent) => {
        if (!blocks) return;
        updateBlock(blocks, e.oldIndex as number, e.newIndex as number);
    };
    // 상하 버튼 클릭 시 실행
    const handleBlock = (index: number, action: 'UP' | 'DOWN') => {
        if (!blocks) return;
        updateBlock(blocks, index, action === 'UP' ? 0 : blocks.length - 1);
    };
    // 상하 버튼 클릭 시 실행 (블록 스타일 변경)
    const toggleMove = (index?: number, action?: 'UP' | 'DOWN'): boolean => {
        if (!blocks) return false;
        if (action === 'DOWN' && index === blocks.length - 1) return true;
        if (index !== undefined && action) {
            setMovingState({ index, action });
        } else {
            setMovingState({ index: null, action: null });
        }
        return false;
    };
    const handleBlockLink = () => {
        setIsBlockLinkOpen(!isBlockLinkOpen);
    };

    const handlePreviewOpen = () => {
        setPreviewModalOpen(!previewModalOpen);
    };

    const handleHowtoOpen = () => {
        setHowtoModalOpen(!howtoModalOpen);
    };

    const handlePrivate = () => {
        if (!token) return;
        setIsPrivate(!isPrivate);
        updatePrivate(token, !isPrivate);
    };

    async function handleLogout() {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('block-storage');
            await router.push('/login');
        } catch (error) {
            console.error(error);
        }
    }

    if (loading)
        return (
            <main className="relative flex min-h-screen w-full max-w-[768px] flex-col gap-2 bg-white">
                <Skeleton width="w-full" height="h-52" />;
                <Skeleton width="w-full" height="h-20" />;
                <Skeleton
                    width="w-full"
                    height="min-h-1/2"
                    className="flex-1"
                />
                ;
            </main>
        );

    return (
        <main className="relative flex min-h-screen w-full max-w-[768px] flex-col gap-5 bg-white">
            {/* 프로필 */}
            <header className="relative flex h-52 w-full flex-col items-center justify-center bg-gray-100 py-8">
                <Link href="/admin/profile/detail">
                    <Image
                        src={'/assets/icons/icon_profile.png'}
                        alt="User Avatar"
                        width={64}
                        height={64}
                    />
                </Link>
                <div className="flex w-full flex-col items-center">
                    <Link href="/admin/profile/detail">
                        <p className="mt-2 font-semibold text-black underline">
                            {userInfo?.name}
                        </p>
                    </Link>

                    <div className="group relative flex w-fit flex-col items-center justify-center gap-1">
                        {/* 토글 버튼 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrivate();
                            }}
                            className={`relative h-5 w-11 rounded-full duration-300 ease-in-out ${isPrivate ? 'bg-blue-500' : 'bg-gray-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                        {/* 말풍선 */}
                        <div
                            className={`relative items-center opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100`}
                        >
                            {/* 말풍선 꼬리 (위쪽에 뾰족한 부분) */}
                            <div className="relative left-1/2 top-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 transform bg-black"></div>
                            {/* 말풍선 본체 */}
                            <div className="rounded-full bg-black px-2 py-1 text-[0.5rem] text-white">
                                <p className="z-10">
                                    프라이빗 설정 버튼 입니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="absolute right-8 top-14 rounded-full bg-white p-1 shadow-md">
                    <Image
                        src={'/assets/icons/icon_menu.png'}
                        alt="menu image"
                        width={20}
                        height={20}
                    />
                </button>
            </header>
            {/* 방문자 카드 */}
            <div className="w-full px-3 text-black">
                <div className="flex w-full rounded-lg border border-gray-300">
                    <div className="w-[70%] border-r-1 border-gray-300 p-3">
                        <p className="title">방문자</p>
                        <div className="flex items-center justify-start gap-2 text-gray-500">
                            <p>
                                전체
                                <span className="text-red-500">
                                    {visitorInfo?.total}
                                </span>
                            </p>
                            <p>
                                오늘
                                <span className="text-red-500">
                                    {visitorInfo?.today}
                                </span>
                            </p>
                            <p>
                                실시간
                                <span className="text-red-500">
                                    {visitorInfo?.realTime}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="p-3">
                        <p className="font-semibold text-black">소식받기</p>
                        <div>
                            <p>
                                전체
                                <span className="text-red-500"> 0</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 h-[10px] w-full bg-gray-200"></div>
            </div>
            {/* 블록 리스트*/}
            <section className="flex flex-1 flex-col px-3 pb-16 pt-3 text-black">
                <h2 className="mb-8 flex items-center gap-1 text-base font-bold">
                    블록 리스트
                    <button
                        className="rounded-full bg-slate-100 p-1"
                        onClick={handleHowtoOpen}
                    >
                        <Image
                            src={'/assets/icons/icon_Q_mark.png'}
                            alt="question mark"
                            width={16}
                            height={16}
                        />
                    </button>
                </h2>

                {blocks && blocks.length > 0 ? (
                    <ReactSortable
                        list={blocks}
                        tag={'ul'}
                        handle=".drag-button"
                        setList={setBlocks}
                        animation={300}
                        onEnd={dragEnd}
                    >
                        {blocks.map((block, i) => (
                            <Block
                                {...block}
                                index={i}
                                key={block.sequence}
                                handleBlock={handleBlock}
                                toggleMove={toggleMove}
                                isMoving={movingState.index !== null}
                                movingIndex={movingState.index}
                                movingAction={movingState.action}
                            />
                        ))}
                    </ReactSortable>
                ) : (
                    <Empty />
                )}

                {isBlockLinkOpen && (
                    <BlockLink handleBlockLink={handleBlockLink} />
                )}

                {howtoModalOpen && (
                    <HowtoModal handleHowtoOpen={handleHowtoOpen} />
                )}

                {previewModalOpen && (
                    <PreviewPage
                        handlePreviewOpen={handlePreviewOpen}
                        name={userInfo.name}
                        blocks={blocks}
                        isPrivate={isPrivate}
                    />
                )}
            </section>
            {/* 미리보기 & 추가 버튼 */}

            <footer
                className={`pointer-events-none fixed bottom-0 left-1/2 flex h-16 w-full max-w-[768px] -translate-x-1/2 items-center justify-between p-3 ${!isBlockLinkOpen && 'bg-gradient-to-b from-transparent to-white'}`}
            >
                <button
                    className="pointer-events-auto absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-gray-100 bg-white p-4 font-semibold text-black shadow-lg"
                    onClick={handlePreviewOpen}
                >
                    미리보기
                </button>

                <button
                    className="pointer-events-auto absolute -top-4 right-3 h-fit w-fit rounded-full bg-primary p-4"
                    onClick={handleBlockLink}
                >
                    <Image
                        src={'/assets/icons/icon_plus.png'}
                        alt="plus icon"
                        width={20}
                        height={20}
                    />
                </button>
            </footer>
        </main>
    );
}
