const params= new URLSearchParams(window.location.search);
const username=params.get("username");
const viewTab=document.querySelector('.view');
const repoTab=document.querySelector('.repo');
const loaderEle=document.querySelector('#loader');
const mainEle=document.querySelector('#mainContent');
const errorEle=document.querySelector('#errorcontainer');
const starTab=document.querySelector('.star')

let currentPage=1;
const perPage=15;

// connecting to overView page

viewTab.addEventListener('click',()=>{
    openOverviewPage(username)
})

function openOverviewPage(username){
    window.location.href=`index.html?username=${username}`
}

// connecting to repository page

repoTab.addEventListener('click',()=>{
     openRepository(username)
})

function openRepository(currentUserName){
  window.location.href=`repository.html?username=${currentUserName}`
}

//connecting to stars page

starTab.addEventListener('click',()=>{
    openStarsPage(username)
})

function openStarsPage(currentUserName){
   window.location.href=`stars.html?username=${currentUserName}`
}



async function fetchUser(username) {
  const res=await fetch(`https://api.github.com/users/${username}`)

     if(!res.ok){
      throw new Error('Request failed try again')
    }

     if(res.status===403){
       throw new Error('GitHub request forbidden. try again later')
    }

    return await res.json()
  
}


async function fetchFollowers(username,page) {
  const res=await fetch(`https://api.github.com/users/${username}/followers?per_page=${perPage}&page=${page}`)
     if(!res.ok){
      throw new Error('Request failed try again')
    }

     if(res.status===403){
       throw new Error('GitHub request forbidden. try again later')
    }

    return await res.json()
  
}


async function userData() {
  mainEle.classList.add('hidden')
  loaderEle.style.display='flex';
   try{
    const [userData,followersData]= await Promise.all([
      fetchUser(username),
      fetchFollowers(username,currentPage)
    ]);

    displayingUserData(userData);
    headerUserPicName(userData);
    displayFollowers(followersData)
    updatePaginationButtons(followersData.length)

   }catch(err){
      errorEle.querySelector('#errorMessage').innerText=`${err.message}`
      errorEle.querySelector('.retryBtn').addEventListener('click',()=>location.reload())
      errorEle.style.display='flex';
   }finally{
      loaderEle.style.display='none';
      mainEle.classList.remove('hidden');
   }
}


function headerUserPicName(data){
      const headerLeftEle=document.querySelector('.left');
      headerLeftEle.innerHTML=`
       <img src=${data.avatar_url} class="user-pic">
       <p class="user">${data.name}</p>
      `
      document.querySelector('.user').addEventListener('click',()=>openOverviewPage(username))
}




function displayingUserData(data){
  const userProfileEle= document.querySelector('.main-left')
   const repoCount=document.querySelector('.repo-count')
   
  userProfileEle.innerHTML=`
        <img class="user-profile" src=${data.avatar_url}>
       <h2 class="user-name">${data.name}</h2>
       <p class="pic-name">${data.login}</p>
      <button class="follow-btn">Follow</button>
       <div class="follow-data">
          <a href="#" class="icon-link">
             <i class="fa-solid fa-users icon"></i> ${data.followers > 1000 ? data.followers/1000 + '.K':data.followers} <span class="color-change followersColor"> followers</span>
        </a>
          <div class="info-followers">
             <a href="#" class="following-link" > .${data.following > 1000 ? data.following/1000+'.K':data.following} <span class="color-change">following</span> </a>
          </div>
            
        </div>  
     
       <div class="info">
           <i class="fa-regular fa-building icon"></i>
           <p class="git-id">${data.company? data.company:'Not Available'}</p>
       </div>
       <div class="info">
           <i class="fa-solid fa-location-dot icon"></i>
           <p class="location">${data.location ? data.location : 'Not Available'}</p>
       </div>
        <div class="info">
           <i class="fa-regular fa-envelope icon"></i>
           <p class="email-info">${data.email ? data.email: 'Not Available'}</p>
       </div>
        <div class="info">
           <i class="fa-solid fa-link icon"></i>
           <p class="git-link">${data.blog ? data.blog : 'Not Available'}</p>
       </div>
  
  `
  repoCount.innerText=`${data.public_repos}`


  const followButton= document.querySelector('.follow-btn')
  
     let status=false;
   followButton.addEventListener('click',()=>{
      
        if(status === true){
          followButton.innerText='Follow'
          followButton.style.backgroundColor='rgb(32, 32, 32)';
          status=false;
        }else{
          followButton.innerText='Following'
          followButton.style.backgroundColor='rgba(68, 67, 67, 1)';
          status=true;
        } 
      
    })

  
   // connecting to following page
   const followingEle=document.querySelector('.info-followers');
   followingEle.addEventListener('click',()=>{
        openFollowingPage(username)
   })

} 

 function openFollowingPage(username){
    window.location.href=`following-page.html?username=${username}`
}


function updatePaginationButtons(count){
      const prevBtn=document.getElementById('prevBtn');
      const nextBtn=document.getElementById('nextbtn');
      const pageNumEle=document.querySelector('.pageNum');

      pageNumEle.innerText=` Page ${currentPage}`

      // disabling previous on page 1
      prevBtn.disabled = currentPage === 1
      
      // if fewer items returned than perpage number --> means last page
      nextBtn.disabled= count < perPage;
      
      
}



function displayFollowers(data){
  const followersEle=document.querySelector('.follower-right')
  followersEle.innerHTML='';
  
  data.forEach((follower)=>{
    followersEle.innerHTML += `
         <div class="follower-container">
           <div class="about-follower">
            <div class="image-user">
            <img src=${follower.avatar_url} class="image">
            <p class="follower-name">${follower.login}</p>
            </div>
            <button class="repo-follow-btn">Follow</button>
          </div>
           <div class="just-border"></div>
        </div>
    
    `
     
    const followerNameEle= document.querySelectorAll('.follower-name');

    followerNameEle.forEach((person)=>{
      person.addEventListener('click',()=>{
         openOverviewPage(person.innerText)
      })
    })
   

  })


  /* repos following button  */

  const repoFollowBtns=document.querySelectorAll('.repo-follow-btn');
 

  repoFollowBtns.forEach((followBtn)=>{

   let status=false

    followBtn.addEventListener('click',()=>{
      
        if(status === true){
          followBtn.innerText='Follow'
          followBtn.style.backgroundColor='rgb(32, 32, 32)';
          status=false;
        }else{
          followBtn.innerText='Following'
          followBtn.style.backgroundColor='rgba(68, 67, 67, 1)';
          status=true;
        } 
      
    })
  })
  

}


document.addEventListener('DOMContentLoaded',()=>{
  userData()
   //adding buttons logic
document.getElementById('prevBtn').addEventListener('click',()=>{
  if(currentPage > 1){
    currentPage--;
    userData()
  }
})

document.getElementById('nextbtn').addEventListener('click',()=>{
    currentPage++;
    userData()
})

})