/*** DEPENDÊNCIAS ***/
const git = require('nodegit');
const path = require('path');
/***/


module.exports = class Wiki {
    constructor(data) {
        this.name = data.name;
        this.url = data.url;
        this.stg = data.stg || __dirname;
    }

    clone() {
        return git.Clone(this.url, path.join(this.stg, this.name))
            .then(repo => this.name + ': Clone repository successfull!')
            .catch(error => {
                console.error(error);
                return this.name + ': Clone repository failed!!';
            });
    }

    pull() {
        let repo;
        return git.Repository.open(path.join(this.stg, this.name))
            .then(repository => {
                repo = repository;
                return repo.fetch('origin')
                    .then(() =>
                        createMasterBranch(repo)
                            .then(succeeded =>
                                succeeded ?
                                    repo.mergeBranches('master', 'origin/master', null, git.Merge.PREFERENCE.FASTFORWARD_ONLY).then(() => true)
                                    : false
                            ))
            })
            .then(() => repo.mergeBranches('master', 'origin/master'))
            .then(() => this.name + ': Pull done!')
            .catch(error => {
                console.error(error);
                return this.name + ': Pull repository failed!!';
            });
    }

}

// PRIVATE FUNCTIONS

function createMasterBranch(repository) {
    const masterRefName = 'master';
    const remoteMasterRefName = 'refs/remotes/origin/master';
    return repository.getBranch(masterRefName).then(ref => true)
        .catch(err =>
            git.Reference.symbolicCreate(repository, 'refs/remotes/origin/HEAD', remoteMasterRefName, 1, 'Set origin head')
                .then(result =>
                    repository.getReference(remoteMasterRefName)
                        .then(remoteMasterRef => {
                            const commitOid = remoteMasterRef.target();
                            return repository.createBranch('master', commitOid) // create master to point to origin/master
                                .then(masterRef => repository.checkoutBranch(masterRef)) // checkout branch to update working directory
                                .then(() => true);
                        })
                        .catch(e => false) // if getting the remote ref fails, continue as usual
                )
        );
}