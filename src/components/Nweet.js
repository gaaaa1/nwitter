import React, { useState } from "react";
import { dbService, storageService } from "../fBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);      // edit를 사용하는지 안하는지 여부 (true or false)
    const [newNweet, setNewNweet] = useState(nweetObj.text);    //수정한 내용을 업데이트하기 위한 용도
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
                            {/* nweet 수정 시 */}
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
                            {/* nweet 수정아닌 경우 일반적인 실시간 nweet를 보여줌 */}
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