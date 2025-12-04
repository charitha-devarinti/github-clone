const searchBtnEle=document.querySelector('.search-btn');

searchBtnEle.addEventListener('click',()=>{
    const searchEle=document.querySelector('.search-user')
    const searchValue=searchEle.value
     getUsers(searchValue)
     userPopularRepos(searchValue)
   
    

})




async function getUsers(username){
   try{
    const response = await fetch(`https://api.github.com/users/${username}`)
      if(!response.ok){
        throw new Error('Requested failed')
      }
      const data=await response.json()
      console.log(data)
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
} 


async function userPopularRepos( username){
    try{
        const response= await fetch(`https://api.github.com/users/${username}/repos?per_page=6`);
         if(!response.ok){
            throw new Error('Request failed')
         }
         const data= await response.json()
        
        displayingPopularRepos(data)
    }catch(error){
        console.log(error)
    }

}

function displayingPopularRepos(data){
    const repoInfo= document.querySelector('.repo-grid')
      repoInfo.innerHTML='';
      data.forEach((repo)=>{
        repoInfo.innerHTML += `
        <div class="repo-info">
         <div class="repo-title">
            <a href="#" class="repo-link">${repo.name}</a>
            <p class="status">Public</p>
         </div>
        <div class="repo-languages">
         <div class="circle"></div>
         <p class="skill">${repo['language'] ? repo['language']:'Not Available'}</p>
        </div> 
      </div>
        
        `
      })
}
