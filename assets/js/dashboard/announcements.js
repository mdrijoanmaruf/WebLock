let announcements=document.querySelector(".announcements"),fetch_announcements=async()=>{var n=await API_REQ({url:"/api/announcements",method:"GET"});if(n.error)return announcements.innerHTML='<div class="center">Something went wrong while fetching announcements!</div>';{if(n.result.length<1)return announcements.innerHTML='<div class="center">No Announcements from the developer at this moment. Please check back later</div>';announcements.innerHTML="";let e;n.result.forEach(n=>{e=n.details?`<a href="${API_BASE}/announcement/${n.id}">See More...</a>`:"",announcements.innerHTML+=`
                <div class="announcement">
                    <p class="title">${n.title}</p>
                    <p class="summery">
                        ${n.summery}
                    </p>
                    <p>
                        ${e}
                    </p>
                </div>
            `})}};fetch_announcements();