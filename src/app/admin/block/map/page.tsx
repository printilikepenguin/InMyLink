'use client';

import React, { useState, useEffect } from 'react';
import BlockHeader from '../components/block-header';
import DaumPost from './components/address';
import PreblockMap from '../components/preview/preblock-map';

export default function MapBlock() {
    // const sequence: number = 9999;
    const [addressObj, setAddressObj] = useState<AddressProps>({
        areaAddress: '',
        townAddress: '',
    });

    const [totalValue, setTotalValue] = useState<MapBlock>({
        type: 8,
        sequence: 0,
        title: '',
        subText01: '',
        subText02: '',
    });

    const handleInputFunction = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const name = event.target.name;
        const value = event.target.value;
        setTotalValue((prev: MapBlock) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 주소 데이터 입력 함수
    useEffect(() => {
        setTotalValue((prev: MapBlock) => ({
            ...prev,
            subText01: JSON.stringify(addressObj),
        }));
    }, [addressObj]);

    return (
        <>
            <BlockHeader
                windowIcon={'/assets/icons/icon_close.png'}
                iconLink={'/admin'}
                blockTitle={'지도 블록'}
                blockDescription={`주소를 검색하여 등록해주세요`}
            />
            <div className="px-10">
                <DaumPost setAddressObj={setAddressObj} />
                <div className="w-full border-b" />
            </div>

            <div className="px-10 pt-10">
                <div className="min-h-1/2 flex w-full flex-1 flex-col items-center justify-center rounded-md bg-gray-100 p-12">
                    <PreblockMap
                        totalValue={totalValue}
                        addressObj={addressObj}
                    />
                </div>

                <div className="my-10 w-full border-b" />

                <div className="mb-10 flex flex-col gap-2">
                    <div className="flex">
                        <label htmlFor="title">장소명</label>
                        <span className="title relative top-1 ml-2 inline-block text-red-500">
                            *
                        </span>
                    </div>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={totalValue.title}
                        onChange={handleInputFunction}
                        placeholder="장소를 잘 나타낼 수 있는 제목을 입력해주세요"
                        className="input"
                    />
                </div>
                <div className="mb-10 flex flex-col gap-2">
                    <div className="flex">
                        <label htmlFor="title">장소설명</label>
                    </div>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={totalValue.subText02}
                        onChange={handleInputFunction}
                        placeholder="장소를 알아보기 쉬운 설명을 덧붙이면 좋아요"
                        className="input"
                    />
                </div>

                <button
                    className={`button color ${totalValue.title.length === 0 ? 'disable' : ''}`}
                >
                    추가 완료
                </button>
            </div>
        </>
    );
}
