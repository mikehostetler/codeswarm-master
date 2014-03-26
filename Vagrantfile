# -*- mode: ruby -*-
# vi: set ft=ruby :
# Special thanks to https://github.com/hoodiehq/hoodie-vagrant

Vagrant.configure("2") do |config|

    config.vm.define :codeswarm_vagrant do |codeswarm_vagrant|

        codeswarm_vagrant.vm.box = "precise64"
        codeswarm_vagrant.vm.box_url = "http://files.vagrantup.com/precise64.box"

        codeswarm_vagrant.ssh.forward_agent = true

        codeswarm_vagrant.vm.network :forwarded_port, guest: 1337, host: 1337
        codeswarm_vagrant.vm.network :forwarded_port, guest: 5984, host: 5984
        codeswarm_vagrant.vm.synced_folder ".", "/opt/project"
        codeswarm_vagrant.vm.provision :puppet do |puppet|
            puppet.manifests_path = "manifests"
            puppet.manifest_file  = "project.pp"
            puppet.options = [
                '--verbose',
                '--debug',
            ]
        end

    end

end
