import React,{useState , useEffect} from 'react'
import axios from 'axios';
function UnverifiedUsers() {
    const [unverifiedList, setunverifiedList] = useState([]);
    const getUnverifiedUsers = async () => {
        try {
          const res = await axios.get(`/om/getunverifiedusers`, {
            headers: {
              authorization: `${localStorage.getItem("tokenid=")}`,
            },
          });
          setunverifiedList(res.data.data);
          console.log(res.data);
        } catch (error) {
          console.log(error.response);
        }
      };
      useEffect(() => {
        getUnverifiedUsers();
      }, []);
  return (
    <div>UnverifiedUsers
        {unverifiedList.map((clg,ind) => {
            return (
                <>
                <h2>Yet to be Implemented</h2>
                </>
            );
        })}
    </div>
  )
}

export default UnverifiedUsers