
import React, { useState, useEffect } from "react";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { dbService } from "../fBase";

const Home = ({ userObj }) => {

    const [nweets, setNweets] = useState([]);
    

    useEffect(() => {
        //nweets firebase의 데이터가 변할때마다 실행됨 (변화를 감지)
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);

    return (
        <div className="container">
            <NweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
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