const searchBtnEle=document.querySelector('.search-btn');
const repoTab=document.querySelector('.repo')
const searchEle=document.querySelector('.search-user')


searchBtnEle.addEventListener('click',()=>{
  
  const searchValue=searchEle.value.trim()
    if(!searchValue){
      alert('Enter a user name...')
      return;
    }
     getUsers(searchValue)
     userPopularRepos(searchValue)
})

// connecting to repository page

repoTab.addEventListener('click',()=>{
     openRepository(searchEle.value.trim())
})

function openRepository(currentUserName){
  window.location.href=`repository.html?username=${currentUserName}`
}

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
  const userProfileEle= document.querySelector('.main-left');
  const repoCount=document.querySelector('.repo-count')
  userProfileEle.innerHTML=`
        <img class="user-profile" src=${data.avatar_url}>
       <h2 class="user-name">${data.name}</h2>
       <p class="pic-name">${data.login}</p>
      <button class="follow-btn">Follow</button>
       <div class="follow-data">
          <p class="icon-link">
             <i class="fa-solid fa-users icon"></i> ${data.followers > 1000 ? data.followers/1000 + '.K':data.followers} <span class="color-change"> followers</span>
        </p>
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
  
  
//connecting to followers page

   const followersEle=document.querySelector('.icon-link')

  followersEle.addEventListener('click',()=>{
       openFollowers(searchEle.value.trim())
})

// connecting to following page
   
const followingEle=document.querySelector('.info-followers')
followingEle.addEventListener('click',()=>{
      openFollowing(searchEle.value.trim())
})

} 



function openFollowers(currentUserName){
  //console.log(currentUserName)
    window.location.href=`followers.html?username=${currentUserName}`
}

function openFollowing(currentUserName){
  //console.log(currentUserName)
  window.location.href=`following-page.html?username=${currentUserName}`
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
            <p  class="repo-link">${repo.name}</p>
            <p class="status">Public</p>
         </div>
        <div class="repo-languages">
         <div class="circle"></div>
         <p class="skill">${repo['language'] ? repo['language']:'Not Available'}</p>
        </div> 
      </div>
        
        `
       
      })

      // adding links to repositories

      const repoLink=document.querySelectorAll('.repo-link')
      repoLink.forEach(repo =>{
        repo.addEventListener('click',()=>{
           // console.log(searchEle.value.trim(),repo.innerText)
            window.location.href=`https://github.com/${searchEle.value.trim()}/${repo.innerText}`
        })
      })
}

