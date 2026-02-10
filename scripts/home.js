const params= new URLSearchParams(window.location.search);
const loginName=params.get("username")||"octocat";

const searchBtnEle=document.querySelector('.search-btn');
const repoTab=document.querySelector('.repo');
const starTab=document.querySelector('.star')
const searchEle=document.querySelector('.search-user');
const loaderEle=document.querySelector('#loader');
const mainEle=document.querySelector('#mainContent');
const errorEle=document.querySelector('#errorcontainer');



searchBtnEle.addEventListener('click',()=>{
  
  const searchValue=searchEle.value.trim()
    if(!searchValue){
      alert('Enter a user name...')
      return;
    }
      userData(searchValue || loginName)
    // getUsers(searchValue || loginName)
    // userPopularRepos(searchValue || loginName)
})

// connecting to repository page

repoTab.addEventListener('click',()=>{
     openRepository(searchEle.value.trim() || loginName)
})

function openRepository(currentUserName){
  window.location.href=`repository.html?username=${currentUserName}`
}

//connecting to stars page

starTab.addEventListener('click',()=>{
    openStarsPage(searchEle.value.trim() || loginName)
})

function openStarsPage(currentUserName){
   window.location.href=`stars.html?username=${currentUserName}`
}


async function userData(username) {

  mainEle.classList.add('hidden')
  loaderEle.style.display='flex';
   try{
    /*
      const[userResponse,reposResponse]= await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=6`)
      ])
        */

    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=6`);

      if(userResponse.status===403){
        throw new Error('GitHub request forbidden. try again later')
      }

      if(userResponse.status===404){
        throw new Error('ooops...User not found!')
      }

      if(!userResponse.ok){
         throw new Error('Unable to fetch user data');
     }

     if( reposResponse.status===403){
         throw new Error('GitHub request forbidden. try again later')
      }
      
      if( reposResponse.status===404){
         throw new Error('Unable to fetch user data')
      }

      if(!reposResponse.ok){
        throw new Error('Unable to fetch repositories')
      }

      
      const userData=await userResponse.json();
      const reposData= await reposResponse.json();
       displayingUserData(userData) ;
       headerUserPicName(userData);
       displayingPopularRepos(reposData);

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
       <img src="${data.avatar_url}" class="user-pic">
       <p class="user">${data.name}</p>
      `
}


function displayingUserData(data){
  const userProfileEle= document.querySelector('.main-left');
  const repoCount=document.querySelector('.repo-count')
  userProfileEle.innerHTML=`
        <img class="user-profile" src="${data.avatar_url}">
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
  
  
//connecting to followers page

   const followersEle=document.querySelector('.icon-link')

  followersEle.addEventListener('click',()=>{

       openFollowers(searchEle.value.trim() || loginName)
})

// connecting to following page
   
const followingEle=document.querySelector('.info-followers')
followingEle.addEventListener('click',()=>{
      openFollowing(searchEle.value.trim() || loginName)
})

} 


function openFollowers(currentUserName){
    window.location.href=`followers.html?username=${currentUserName}`
}

function openFollowing(currentUserName){
  window.location.href=`following-page.html?username=${currentUserName}`
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
            window.location.href=`https://github.com/${searchEle.value.trim()}/${repo.innerText}`
        })
        
      })
}



document.addEventListener('DOMContentLoaded',()=>{
              
          // if(loginName){
          //     userData(loginName)
      
          // }

          const finalName = loginName || "octocat";
          userData(finalName);
        
     if(!sessionStorage.getItem('alertShown')){
        alert(`First search for a user in search box....
               at first it shows dummy one..`)
        sessionStorage.setItem('alertShown',"true")
     }

})


