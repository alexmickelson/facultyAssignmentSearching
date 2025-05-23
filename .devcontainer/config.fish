# Only execute this file once per shell.

# https://gist.github.com/thomd/7667642
export LS_COLORS=':di=95'

function commit
    git add --all
    git commit -m "$argv"
    git pull
    git push
end

bind \e\[3\;5~ kill-word
bind \b backward-kill-word

set fish_pager_color_selected_background --background='00399c'

export VISUAL=vim
export EDITOR="$VISUAL"

status is-login; and begin
    # Login shell initialisation
end
status is-interactive; and begin

    # Abbreviations


    # Aliases


    # Interactive shell initialisation
    # add completions generated by Home Manager to $fish_complete_path
    begin
        set -l joined (string join " " $fish_complete_path)
        set -l prev_joined (string replace --regex "[^\s]*generated_completions.*" "" $joined)
        set -l post_joined (string replace $prev_joined "" $joined)
        set -l prev (string split " " (string trim $prev_joined))
        set -l post (string split " " (string trim $post_joined))
    end


end