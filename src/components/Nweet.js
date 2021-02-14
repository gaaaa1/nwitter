import React, { useState } from "react";
import { dbService, storageService } from "../fBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);      // edit�� ����ϴ��� ���ϴ��� ���� (true or false)
    const [newNweet, setNewNweet] = useState(nweetObj.text);    //������ ������ ������Ʈ�ϱ� ���� �뵵
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            //delete
            await dbService.doc("nweets/" + nweetObj.id).delete();  //document.collection/nweetsID.delete
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(nweetObj, newNweet)
        await dbService.doc("nweets/" + nweetObj.id).update({
            text:newNweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const { value } = event.target;
        setNewNweet(value);
    };
    return (
        <div className="nweet">
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            {/* nweet ���� �� */}
                            <input
                                type="text"
                                placeholder="Edit your nweet"
                                value={newNweet}
                                onChange={onChange}
                                required
                            />
                            <input type="submit" value="Update Nweet" className="formBtn" />
                        </form>
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                    </>
                ) : (
                        <>
                            {/* nweet �����ƴ� ��� �Ϲ����� �ǽð� nweet�� ������ */}
                            <h4>{nweetObj.text}</h4>
                            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
                            {isOwner && (
                                <div class="nweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>
                            )}
                        </>
                )}
        </div>
    );
}

export default Nweet;