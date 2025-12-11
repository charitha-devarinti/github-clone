const params= new URLSearchParams(window.location.search);
const username=params.get("username");

const filterItem= document.querySelector('.filter-input');

let currentPage=1;
const perPage=20;

async function fetchingCurrentuser(username){
  const response= await fetch(`https://api.github.com/users/${username}`)
  if(!response.ok){
    throw new Error('Request failed')
  }
  const data= await response.json();
  console.log(data)
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


async function userRepos( username,page=1){
    try{
        const response= await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`);
         if(!response.ok){
            throw new Error('Request failed')
         }
         const data= await response.json()
        
        displayingUserRepos(data)
        updatePaginationButtons(data.length)
    }catch(error){
        console.log(error)
    }

} 

function updatePaginationButtons(count){
    const prevBtn=document.querySelector('.prevBtn');
    const nextBtn=document.querySelector('.nextBtn')
     
    prevBtn.disabled=currentPage===1

    nextBtn.disabled= count < perPage;

}

function displayingUserRepos(data){
    const repoInfo= document.querySelector('.repos-all');
      repoInfo.innerHTML='';
      data.forEach((repo)=>{
        repoInfo.innerHTML += `
            <div class="each-repo">
            <div class="repo-and-status">
              <h3 class="repo-name">${repo.name}</h3>
              <p class="repo-status">Public</p>
            </div>
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
             // console.log(username,repo.innerText)
             window.location.href=`https://github.com/${username}/${repo.innerText}`
           })
       })
}


function filterRepos(e){
  const repoItems= document.querySelectorAll('.repos-all .each-repo')
  const filterItem=e.target.value.toLowerCase();
 console.log(filterItem)
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
    fetchingCurrentuser(username)
    getUsers(username)
    userRepos(username)

    document.querySelector('.prevBtn').addEventListener('click',()=>{
      if(currentPage >1){
        currentPage--;
        userRepos(username,currentPage)
      }
    })

    document.querySelector('.nextBtn').addEventListener('click',()=>{
      
      currentPage++;
      userRepos(username,currentPage)
    })
})