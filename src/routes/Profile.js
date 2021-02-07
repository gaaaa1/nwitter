import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fBase";

export default ({ userObj }) => {
    const history = useHistory();
    const getMyNweets = async () => {
        //쿼리 , 데이터베이스에서 userid로 입력된 데이터 가져오기 및 일자별로 정렬
        const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid)
            .orderBy("createdAt").get();
        console.log(nweets.docs.map(doc => doc.data()));
    };
    useEffect(() => {
        getMyNweets();
    }, []);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const onChange = (event) => {
        const { target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = (event) => {
        event.preventDefault();
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display name" />
            <input type="submit" value="Update Profile"/>
        </form>

            <button onClick={ onLogOutClick }>Log Out</button>
        </>
    );
}