const params= new URLSearchParams(window.location.search);
const username=params.get("username");

/*
async function fetchingCurrentuser(username){
  const response= await fetch(`https://api.github.com/users/${username}`)
  if(!response.ok){
    throw new Error('Request failed')
  }
  const data= await response.json();
  console.log(data)
}

*/




async function getUsers(username){
   try{
    const response = await fetch(`https://api.github.com/users/${username}`)
      if(!response.ok){
        throw new Error('Requested failed')
      }
      const data=await response.json()
       //----------------
     
       //---------------
       displayingUserData(data) ;
       headerUserPicName(data)
   }catch(error){
    console.log(error)
   }
}

function headerUserPicName(data){
      const headerLeftEle=document.querySelector('.left');
      headerLeftEle.innerHTML=`
       <img src=${data.avatar_url} class="user-pic">
       <p class="user">${data.name}</p>
      `
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
             <i class="fa-solid fa-users icon"></i> ${data.followers > 1000 ? data.followers/1000 + '.K':data.followers} <span class="color-change"> followers</span>
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
} 


async function getFollowers(username){
try{
      const response= fetch(`https://api.github.com/users/${username}/followers`)
      if(!response.ok){
        throw new Error('Requested failed')
      }
      const data=(await response).json()
     
      displayFollowers(data)

}catch(err){
  console.log(err)

}

}

function displayFollowers(data){
  const followersEle=document.querySelector('.follower-right')
  followersEle.innerHTML='';
  
  data.forEach((follower)=>{
    follower.innerHTML += `
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
  })

 

}

getFollowers(username)
getUsers(username)