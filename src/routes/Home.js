
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Nweet from "../components/Nweet";
import { dbService, storageService } from "../fBase";

const Home = ({ userObj }) => {

    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        //nweets firebase�� �����Ͱ� ���Ҷ����� ����� (��ȭ�� ����)
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";

        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(userObj.uid + '/' + uuidv4());
            const reponse = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await reponse.ref.getDownloadURL();
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        };

        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        // file�� �о���� �о�� ���ϵ��� �迭�� �������
        const {
            target: { files },
        } = event;
        const theFile = files[0]; //�������� �����ص� �ϳ��� �о���� ����
                                  //console.log(files) �ؼ� ���� �迭�� ��������
        const reader = new FileReader();  //������ �о�� ��ü ����
        reader.onloadend = (finishedEvent) => {
            const {
                // ���������� �о�� ������ �迭���� ������ url ���� �������ִ� result�� ã��
                currentTarget: { result },
            } = finishedEvent;
            // �о�� ���� url�� Attachment�� �־���
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);  // ������ url�� ���� �о��

    }

    const onClearAttachmentClick = () => {
        //���ε�� ������ ����� ���
        //���� �ּҸ� �������ִ� attachment�� null ������ ����
        setAttachment(null);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                {/* nweet �Է� �� */}
                <input
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Nweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={ onClearAttachmentClick }>clear</button>
                    </div>
                )}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};
export default Home;