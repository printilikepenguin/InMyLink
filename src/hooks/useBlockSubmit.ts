import { useRouter, useSearchParams } from 'next/navigation';
import useBlockStore from 'store/useBlockStore';
import useToken from 'store/useToken';
import { addBlock, updateBlock } from 'service/api/block-api';
import { validateURL } from 'service/validation';
import { deleteImage } from 'service/firebase';

export function useBlockSubmit() {
    const router = useRouter();
    const { block, resetBlock, blocks } = useBlockStore();
    const { token } = useToken();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const handleSubmit = async <T extends BlocksUnionType>(
        e: React.FormEvent<HTMLFormElement>,
        blockType: T['type'],
        imgUrl?: string,
    ) => {
        e.preventDefault();
        if (!token) return;

        try {
            // 블록 수정
            if (id) {
                if (block.url && !validateURL(block?.url)) {
                    return alert('올바른 URL을 입력해주세요');
                } else {
                    const blockData = { ...block };
                    if (imgUrl) {
                        blockData['imgUrl'] = imgUrl;
                    }
                    await updateBlock({
                        accessToken: token,
                        blockData,
                    });
                }
            } else {
                // 블록 추가
                const formData = new FormData(e.target as HTMLFormElement);
                imgUrl && formData.set('imgUrl', imgUrl);

                const formEntries = Object.fromEntries(formData.entries());
                const maxSequence = blocks
                    ? Math.max(...blocks.map((b) => b.sequence), 0)
                    : 0;

                const newBlock: T = {
                    ...formEntries,
                    type: blockType,
                    sequence: maxSequence + 1,
                } as T;

                if ('style' in newBlock) {
                    newBlock.style = Number(newBlock.style);
                }

                if ('url' in newBlock) {
                    if (newBlock.url && !validateURL(newBlock.url))
                        return alert('올바른 URL을 입력해주세요');
                }
                // console.log(newBlock, 'newBlock');
                await addBlock({
                    accessToken: token,
                    blockData: newBlock,
                });
            }
            router.push('/admin');
            resetBlock();
        } catch (error) {
            console.log(error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            if (imgUrl) {
                await deleteImage(imgUrl);
            }
        }
    };

    return { handleSubmit, block, paramsId: id };
}
