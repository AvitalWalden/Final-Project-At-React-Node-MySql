import { AbilityBuilder, createMongoAbility } from '@casl/ability';

function defineAbilitiesFor(role) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    switch (role) {
        case 'admin':
            can('manage', 'all'); // Admin can manage everything
            break;

        case 'manager':
            can('manage', 'users'); // Manager can manage users
            can('read', 'reports'); // Manager can read reports
            break;

        case 'editor':
            can('create', 'articles'); // Editor can create articles
            can('read', 'articles'); // Editor can read articles
            can('update', 'articles'); // Editor can update articles
            cannot('delete', 'articles'); // Editor cannot delete articles
            break;

        case 'viewer':
            can('read', 'articles'); // Viewer can only read articles
            break;

        default:
            can('read', 'public'); // Default role can read public content
            break;
    }

    return build();
};

export { defineAbilitiesFor };
