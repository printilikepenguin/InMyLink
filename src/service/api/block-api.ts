// 블록 추가 API 호출 함수
export const addBlock = async (params: AddBlockParams) => {
    const { accessToken, blockData } = params;
    const response = await fetch('/api/link/add', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
    });

    if (response.ok) {
        const result = await response.json();
        return result.data;
    } else {
        throw new Error('Failed to add block');
    }
};

// 블록 업데이트 API 호출 함수
export const updateBlock = async (params: UpdateBlockParams) => {
    const { accessToken, blockData } = params;
    const response = await fetch('/api/link/update', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
    });

    if (response.ok) {
        const result = await response.json();
        return result.data;
    } else {
        throw new Error('Failed to add block');
    }
};

// 캘린더 블록 업데이트 API 호출 함수
export const updateCalBlock = async (params: AddBlockParams) => {
    const { accessToken, blockData } = params;
    const response = await fetch('/api/link/update', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
    });

    if (response.ok) {
        const result = await response.json();
        return result.data;
    } else {
        throw new Error('Failed to add block');
    }
};
