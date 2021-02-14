
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {

    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }
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
        // file을 읽어오면 읽어온 파일들의 배열을 만들어줌
        const {
            target: { files },
        } = event;
        const theFile = files[0]; //여러개를 선택해도 하나만 읽어오게 설정
        //console.log(files) 해서 보면 배열로 리턴해줌
        const reader = new FileReader();  //파일을 읽어올 객체 생성
        reader.onloadend = (finishedEvent) => {
            const {
                // 성공적으로 읽어온 파일의 배열에서 파일의 url 값을 가지고있는 result를 찾음
                currentTarget: { result },
            } = finishedEvent;
            // 읽어온 파일 url을 Attachment에 넣어줌
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);  // 파일의 url을 통해 읽어옴

    }

    const onClearAttachment = () => {
        //업로드된 사진을 지우는 기능
        //사진 주소를 가지고있는 attachment를 null 값으로 만듬
        setAttachment("");
    }

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            {/* nweet 입력 시 */}
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
          
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
}

export default NweetFactory;