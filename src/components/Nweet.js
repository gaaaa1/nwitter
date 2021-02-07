import React, { useState } from "react";
import { dbService, storageService } from "../fBase";

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
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}> 
                            // �ּ��׽�Ʈ
                            <input
                                type="text"
                                placeholder="Edit your nweet"
                                value={newNweet}
                                onChange={onChange}
                                required
                            />
                            <input type="submit" value="Update Nweet" />
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                        <>
                            <h4>{nweetObj.text}</h4>
                            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} width = "50px" height="50px" />}
                            {isOwner && (
                                <>
                                    <button onClick={onDeleteClick}>Delete Nweet</button>
                                    <button onClick={toggleEditing}>Edit Nweet</button>
                                </>
                            )}
                        </>
                )}
        </div>
    );
}

export default Nweet;