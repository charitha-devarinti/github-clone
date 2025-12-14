const params= new URLSearchParams(window.location.search);
const username=params.get("username");
const filterItem= document.querySelector('.filter-input');
const loaderEle=document.querySelector('#loader');
const mainEle=document.querySelector('#mainContent');
const errorEle=document.querySelector('#errorcontainer');
const viewTab=document.querySelector('.view');
const repoTab=document.querySelector('.repo');


let currentPage=1;
const perPage=20;

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


async function fetchUser(username) {
  const res=await fetch(`https://api.github.com/users/${username}`,{
      headers:{
         Authorization: `token ${GITHUB_TOKEN}`
      }
    })

    if(!res.ok){
      throw new Error('Request failed try again')
    }

    return await res.json()
  
}

async function fetchStarRepos(username,page) {
  const res= await fetch(`https://api.github.com/users/${username}/starred?per_page=${perPage}&page=${page}`,{
      headers:{
         Authorization: `token ${GITHUB_TOKEN}`
      }
    })

    if(!res.ok){
      throw new Error('Request failed try again')
    }

    return await res.json()
  
}


async function userData() {
  mainEle.classList.add('hidden')
  loaderEle.style.display='flex';
   try{
    const [userData,reposData]= await Promise.all([
      fetchUser(username),
      fetchStarRepos(username,currentPage)
    ]);
    headerUserPicName(userData)
    displayingUserData(userData);
    displayingUserStaredRepos(reposData);
    updatePaginationButtons(reposData.length)
   

   }catch(err){
      errorEle.querySelector('#errorMessage').innerText=`${err.message}`
      errorEle.querySelector('.retryBtn').addEventListener('click',()=>openOverviewPage(username))
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
   const followersEle=document.querySelector('.icon-link');
   followersEle.addEventListener('click',()=>{
     openFollowersPage(username)
     
   })

   // connecting to following page
   const followingEle=document.querySelector('.info-followers');
   followingEle.addEventListener('click',()=>{
        openFollowingPage(username)
   })

}


function openFollowersPage(username){
   window.location.href=`followers.html?username=${username}`
 //console.log(username)
}

function openFollowingPage(username){
    window.location.href=`following-page.html?username=${username}`
}


function updatePaginationButtons(count){
    const prevBtn=document.querySelector('.prevBtn');
    const nextBtn=document.querySelector('.nextBtn');
    const pageNumEle=document.querySelector('.pageNum');

    pageNumEle.innerText=` Page ${currentPage}`
     
    prevBtn.disabled=currentPage===1;

    nextBtn.disabled= count < perPage;

}


function displayingUserStaredRepos(data){
    const repoInfo= document.querySelector('.repos-all');
      repoInfo.innerHTML='';
      data.forEach((repo)=>{
        repoInfo.innerHTML += `
            <div class="each-repo">
            <div class="repo-and-status">
              <h3 class="repo-name">${repo.name}</h3>
              <p class="repo-status">Public</p>
            </div>
             <p class="description">${repo.description}</p>
            <div class="skill-and-star">
              <div class="color-and-skill">
                  <div class="color-circle"></div>
                  <p class="used-skill">${repo['language'] ? repo['language']:'Not Available'}</p>
              </div>
              <div class="star-num">
                   <i class="fa-regular fa-star star-icon"></i>
                   <p class="star-count">${repo.stargazers_count}</p> 
              </div>
            </div>
            <div class="just-border"></div>
       </div>
        
        `
      })

      //adding links to repositories
      const repoNameEle=document.querySelectorAll('.repo-name');
       repoNameEle.forEach((repo)=>{
           repo.addEventListener('click',()=>{
             window.location.href=`https://github.com/${username}/${repo.innerText}`
           })
       })
}



// adding filtering feature to repositories
function filterRepos(e){
  const repoItems= document.querySelectorAll('.repos-all .each-repo')
  const filterItem=e.target.value.toLowerCase();
 //console.log(filterItem)
 repoItems.forEach((repo)=>{
      const repoName= repo.querySelector('.repo-name').textContent.toLowerCase();
     
      if(repoName.includes(filterItem)){
        repo.style.display='block';
      }else{
        repo.style.display='none'
      }
      
     
 })
}



filterItem.addEventListener('input',filterRepos)



document.addEventListener('DOMContentLoaded',()=>{ 
   userData()
    document.querySelector('.prevBtn').addEventListener('click',()=>{
      if(currentPage >1){
        currentPage--;
        userData()
      }
    })

    document.querySelector('.nextBtn').addEventListener('click',()=>{
       currentPage++;
      userData();
    })
})